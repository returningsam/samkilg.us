var canv;
var ctx;

var max_width;
var max_height;
var ratio_mult = 1;

var chance;
var cur_seed;

var radius;

var circles = [];
var old_circles = [];

var draw_interval;

var color_bw = "change";
var min_radius = 1;
var max_radius = 100;

var max_mv = 1;
var num_circ_div_max = 60;
var num_circ_div_min = 20;
var num_circ;

var cur_x;
var cur_y;

var ch_radius;

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 */
function rand_int(min, max) {
  try {
    return chance.integer({min: min, max: max});
  }
  catch (e) {
    return chance.integer({min: max, max: min});
  }
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 */
function rand_float(min, max) {
  try {
    return chance.floating({min: min, max: max});
  }
  catch (e) {
    return chance.floating({min: max, max: min});
  }
}

function rand_color() {
  if (color_bw) {
    return [rand_int(10,255),rand_int(10,255),rand_int(10,255)];
  }
  else {
    var rgb = rand_int(10,255);
    return [rgb,rgb,rgb];
  }
}

function shuffle_array(o) {
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

function inc_color(color) {
  if (color_bw) {
    return [
      rand_int(Math.max(10,color[0]-rand_int(2,3)),Math.min(255,color[0]+rand_int(2,3))),
      rand_int(Math.max(10,color[1]-rand_int(2,3)),Math.min(255,color[1]+rand_int(2,3))),
      rand_int(Math.max(10,color[2]-rand_int(2,3)),Math.min(255,color[2]+rand_int(2,3)))
    ];
  }
  else {
    var color_dif = rand_int(2,3);
    var new_rgb = rand_int(Math.max(10,color[0]-color_dif),Math.min(255,color[0]+color_dif));
    return [new_rgb, new_rgb, new_rgb];
  }
}

function to_color_str(color) {
  return "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")";
}

function get_dist(x1,y1,x2,y2) {
  var a = x1 - x2;
  var b = y1 - y2;
  return Math.sqrt((a*a)+(b*b));
}

function new_dif() {
  if (rand_int(0,1)) {
    return rand_float(0.1,max_mv);
  }
  else {
    return rand_float(-max_mv,-0.1);
  }
}

function check_radius(rad) {
  if (rad < min_radius) {
    return min_radius;
  }
  else if (rad > max_radius) {
    return max_radius;
  }
  else {
    return rad;
  }
}

function check_x(x,radius) {
  if (x - radius <= 0) {
    return false;
  }
  else if (x + radius >= max_width) {
    return false;
  }
  return true;
}

function check_y(y,radius) {
  if (y - radius <= 0) {
    return false;
  }
  else if (y + radius >= max_height) {
    return false;
  }
  return true;
}

function new_circ() {
  var x;
  var y;
  var radius;
  var valid = false;
  var nopes = [];
  while (!valid) {
    radius = rand_float(min_radius,max_radius);
    x = rand_float(radius,max_width-radius);
    y = rand_float(radius,max_height-radius);
    var coord_str = x.toString() + ":" + y.toString();
    valid = true;
    if (nopes.indexOf(coord_str) < 0) {
      for (var i = 0; i < circles.length; i++) {
        var min_dif = radius + circles[i].radius + 1;
        if (get_dist(x,y,circles[i].x,circles[i].y) < min_dif) {
          valid = false;
          nopes.push(coord_str);
          break;
        }
      }
    }
  }
  var x_dif = new_dif();
  var y_dif = new_dif();
  var circle = {
    color: rand_color(),
    x: x,
    y: y,
    x_dif: x_dif,
    y_dif: y_dif,
    radius: radius
  }
  return circle;
}

function next_circ(cur,depth) {
  var x = circles[cur].x + circles[cur].x_dif;
  var y = circles[cur].y + circles[cur].y_dif;
  var radius = check_radius(circles[cur].radius + rand_float(-0.5,0.5));
  var valid = true;
  var count = 0;
  do {
    radius = check_radius(circles[cur].radius + rand_float(-0.5,0.5));
    valid = true;
    for (var i = 0; i < circles.length; i++) {
      if (i != cur) {
        var min_dif = radius + circles[i].radius;
        if (get_dist(x,y,circles[i].x,circles[i].y) < min_dif) {

          var old_mom_x = (circles[cur].x_dif * radius) + (circles[i].x_dif * circles[i].radius);
          var old_mom_y = (circles[cur].y_dif * radius) + (circles[i].y_dif * circles[i].radius);

          var change_x = (x - circles[i].x) / get_dist(x,y,circles[i].x,circles[i].y);
          var change_y = (y - circles[i].y) / get_dist(x,y,circles[i].x,circles[i].y);

          circles[cur].x_dif = max_mv * change_x * (circles[i].radius / (circles[i].radius + radius));
          circles[cur].y_dif = max_mv * change_y * (circles[i].radius / (circles[i].radius + radius));

          var change_x = -(x - circles[i].x) / get_dist(x,y,circles[i].x,circles[i].y);
          var change_y = -(y - circles[i].y) / get_dist(x,y,circles[i].x,circles[i].y);

          circles[i].x_dif = max_mv * change_x * (radius / (circles[i].radius + radius));
          circles[i].y_dif = max_mv * change_y * (radius / (circles[i].radius + radius));

          var new_mom_x = (circles[cur].x_dif * radius) + (circles[i].x_dif * circles[i].radius);
          var new_mom_y = (circles[cur].y_dif * radius) + (circles[i].y_dif * circles[i].radius);

          circles[cur].x_dif += ((old_mom_x - new_mom_x) / radius) * (radius / (circles[i].radius + radius));
          circles[cur].y_dif += ((old_mom_y - new_mom_y) / radius) * (radius / (circles[i].radius + radius));
          circles[i].x_dif += ((old_mom_x - new_mom_x) / circles[i].radius) * (circles[i].radius / (circles[i].radius + radius));
          circles[i].y_dif += ((old_mom_y - new_mom_y) / circles[i].radius) * (circles[i].radius / (circles[i].radius + radius));

          // x = circles[cur].x + circles[cur].x_dif;
          // y = circles[cur].y + circles[cur].y_dif;
          // if (depth < 20) {
          //   next_circ(i,depth+1);
          // }
          valid = false;
          break;
        }
      }
    }

    if (get_dist(x,y,cur_x,cur_y) < radius) {
      var old_mom_x = (circles[cur].x_dif * radius);
      var old_mom_y = (circles[cur].y_dif * radius);

      var change_x = (x - cur_x) / get_dist(x,y,cur_x,cur_y);
      var change_y = (y - cur_y) / get_dist(x,y,cur_x,cur_y);

      circles[cur].x_dif = max_mv * change_x / 2;
      circles[cur].y_dif = max_mv * change_y / 2;

      var new_mom_x = (circles[cur].x_dif * radius);
      var new_mom_y = (circles[cur].y_dif * radius);

      circles[cur].x_dif += ((old_mom_x - new_mom_x) / radius) / 2;
      circles[cur].y_dif += ((old_mom_y - new_mom_y) / radius) / 2;
    }
    x = circles[cur].x + circles[cur].x_dif;
    y = circles[cur].y + circles[cur].y_dif;

    if (!check_x(x,radius)) {
      circles[cur].x_dif = -circles[cur].x_dif;
    }
    if (x-radius < 0) x = radius;
    if (x+radius > max_width) x = max_width-radius;
    if (!check_y(y,radius)) {
      circles[cur].y_dif = -circles[cur].y_dif;
    }
    if (y-radius < 0) y = radius;
    if (y+radius > max_height) y = max_height-radius;

    count++;
  } while (!valid && count < 100);


  if (count < 100) {
    circles[cur].radius = radius;
    circles[cur].x = x;
    circles[cur].y = y;
    circles[cur].color = inc_color(circles[cur].color);
  }
  else {
    circles[cur].color = inc_color(circles[cur].color);
  }
}

function draw_circle(circle) {
  ctx.moveTo(circle.x,circle.y);
  ctx.beginPath();
  ctx.arc(circle.x,circle.y,circle.radius,0,2*Math.PI);
  ctx.fillStyle = to_color_str(circle.color);
  ctx.fill();
}

function new_layer() {
  if (circles.length < 1) {
    for (var i = 0; i < num_circ; i++) {
      circles.push(new_circ());
    }
  }
  else {
    circles = shuffle_array(circles);
    for (var i = 0; i < circles.length; i++) {
      next_circ(i,0);
    }
  }
  for (var i = 0; i < circles.length; i++) {
    draw_circle(circles[i]);
  }
  if (draw) {
    setTimeout(new_layer, 1);
  }
}

var redraw_timeout;

function new_drawing(reset_center) {
  if (redraw_timeout) {
    clearTimeout(redraw_timeout);
  }
  draw = false;
  redraw_timeout = setTimeout(function () {
    draw = true;
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,max_width,max_height);
    new_seed();
    init_vars();
    new_layer();
  }, 100);
}

function init_vars() {
  circles = [];
  old_circles = [];
  console.log(num_circ);
  num_circ = Math.min(Math.round(max_width/rand_int(num_circ_div_min,num_circ_div_max)),Math.round(max_height/rand_int(num_circ_div_min,num_circ_div_max)));
  console.log(num_circ);
  if (color_bw == "change") {
    color_bw = (rand_int(0,1) == 0);
  }
  color_bw = !color_bw;
  ch_radius = (rand_int(0,1) == 0);
}

function init_canv() {
  max_width = window.innerWidth * ratio_mult;
  max_height = window.innerHeight * ratio_mult;
  canv = document.getElementById('canvas');
  ctx = canv.getContext('2d');

  canv.width = max_width;
  canv.height = max_height;

  ctx.fillStyle = "black";
  ctx.fillRect(0,0,max_width,max_height);
}

function new_seed() {
  var input_string = "";
  var str_ops = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890".split("");
  for (var i = 0; i < 10; i++) {
    input_string += (str_ops[rand_int(0,str_ops.length-1)]);
  }
  cur_seed = input_string;
  chance = new Chance(input_string);
}

var mouse_timeout;

function init() {
  init_canv();
  new_drawing();
  canv.addEventListener('click',function (mouse_ev) {
    new_drawing();
  });
  canv.addEventListener('mousemove',function (mouse_ev) {
    cur_x = mouse_ev.pageX * ratio_mult;
    cur_y = mouse_ev.pageY * ratio_mult;
  });
  setInterval(function () {
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.fillRect(0,0,canv.width,canv.height);
  }, 50);
}

window.onload = init;
window.onresize = function () {
  init_canv();
  num_circ = Math.min(Math.round(max_width/rand_int(num_circ_div_min,num_circ_div_max)),Math.round(max_height/rand_int(num_circ_div_min,num_circ_div_max)));
  new_drawing();
};
