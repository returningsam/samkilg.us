var canv;
var ctx;

var max_width;
var max_height;
var ratio_mult = 1;

var chance;
var cur_seed;

var radius;

var circles = [];

var cur_x;
var cur_y;

var draw_interval;

var keep_adding = true;

var color_bw;

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 */
function r_in_r(min, max) {
  return chance.integer({min: min, max: max});
}

function rand_color() {
  if (color_bw) {
    return [r_in_r(0,255),r_in_r(0,255),r_in_r(0,255)];
  }
  else {
    var rgb = r_in_r(0,255);
    return [rgb,rgb,rgb];
  }
}

function inc_color(color) {

  if (color_bw) {
    console.log(color_bw);
    return [
      r_in_r(Math.max(0,color[0]-r_in_r(2,10)),Math.min(255,color[0]+r_in_r(2,10))),
      r_in_r(Math.max(0,color[1]-r_in_r(2,10)),Math.min(255,color[1]+r_in_r(2,10))),
      r_in_r(Math.max(0,color[2]-r_in_r(2,10)),Math.min(255,color[2]+r_in_r(2,10)))
    ];
  }
  else {
    var color_dif = r_in_r(2,10);
    var new_rgb = r_in_r(Math.max(0,color[0]-color_dif),Math.min(255,color[0]+color_dif));
    return [
      new_rgb,
      new_rgb,
      new_rgb
    ];
  }
}

function to_color_str(color) {
  return "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")";
}

function new_circ(min_x, max_x, min_y, max_y) {
  var circle = {
    color: rand_color(),
    point: [
      r_in_r(min_x,max_x),
      r_in_r(min_y,max_y)
    ]
  }
  return circle;
}

function next_circle(prev,targ) {
  var max_ch_x = r_in_r(1,Math.max(2,Math.abs(prev.point[0] - targ[0])/15));
  var max_ch_y = r_in_r(1,Math.max(2,Math.abs(prev.point[1] - targ[1])/15));
  var change_x = 0;
  var change_y = 0;

  if (prev.point[0] < targ[0]) {
    change_x = r_in_r(max_ch_x / -3,max_ch_x);
  }
  else if (prev.point[0] > targ[0]) {
    change_x = -1 * r_in_r(max_ch_x / -3,max_ch_x);
  }
  else {
    change_x = r_in_r(-max_ch_x,max_ch_x);
  }
  if (prev.point[1] < targ[1]) {
    change_y = r_in_r(max_ch_y / -3,max_ch_y);
  }
  else if (prev.point[1] > targ[1]) {
    change_y = -1 * r_in_r(max_ch_y / -3,max_ch_y);
  }
  else {
    change_y = r_in_r(-max_ch_y,max_ch_y);
  }

  var circle = {
    color: inc_color(prev.color),
    point: [prev.point[0] + change_x,prev.point[1] + change_y]
  }
  return circle;
}

function new_edge_circ() {
  var choice = r_in_r(0,3);
  switch (choice) {
    case 0:
      return new_circ(0,0,0,max_height);
      break;
    case 1:
      return new_circ(max_width,max_width,0,max_height);
      break;
    case 2:
      return new_circ(0,max_width,0,0);
      break;
    case 3:
      return new_circ(0,max_width,max_height,max_height);
      break;
  }
}

function gen_circles() {
  circles = [];
  circles.push(new_edge_circ());
  var end_circ = new_circ(cur_x,cur_x,cur_y,cur_y);
  var i = 1;
  while ((circles[i-1].point[0] > end_circ.point[0] + 5 ||
      circles[i-1].point[0] < end_circ.point[0] - 5) ||
      (circles[i-1].point[1] > end_circ.point[1] + 5 ||
      circles[i-1].point[1] < end_circ.point[1] - 5)) {
    circles.push(next_circle(circles[i-1],end_circ.point));
    i++;
  }
}

var adding_time;

function add_circ() {
  var end_circ = new_circ(cur_x,cur_x,cur_y,cur_y);
  var i = circles.length;
  circles.push(next_circle(circles[i-1],end_circ.point));
  if ((circles[i-1].point[0] > end_circ.point[0] + 5 ||
      circles[i-1].point[0] < end_circ.point[0] - 5) ||
      (circles[i-1].point[1] > end_circ.point[1] + 5 ||
      circles[i-1].point[1] < end_circ.point[1] - 5)) {
    adding_time = setTimeout(function () {
      add_circ();
    }, 1);
  }
}

function gen_more_circles() {
  add_circ();
}

var draw_tim;

function draw_circle() {
  var i = 0;
  while (i < 10 && circles.length > 1) {
    var circ = circles.splice(0,1)[0];
    radius += r_in_r(-1,1) * ratio_mult;
    if (radius < 10 * ratio_mult) radius = 10 * ratio_mult;
    if (radius > 40 * ratio_mult) radius = 40 * ratio_mult;
    ctx.beginPath();
    ctx.arc(circ.point[0],circ.point[1],radius,0,2*Math.PI);
    ctx.fillStyle = to_color_str(circ.color);
    ctx.fill();
    ctx.moveTo(circ.point[0],circ.point[1]);
    i++;
  }
  if (circles.length > 1) {
    draw_tim = setTimeout(function () {
      draw_circle();
    },1);
  }
  else {
    setTimeout(new_layer,1);
  }
}

function init_vars() {
  circles = [];
  max_width = window.innerWidth * ratio_mult;
  max_height = window.innerHeight * ratio_mult;
  radius = 50 * ratio_mult;;
  color_bw = !color_bw;
}

function init_canv() {
  canv = document.getElementById('canvas');
  ctx = canv.getContext('2d');

  canv.width = max_width;
  canv.height = max_height;
  ctx.clearRect(0,0,canv.width,canv.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0,0,max_width,max_height);
}

function seed_tha_thing() {
  var input_string = "";
  var str_ops = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890".split("");
  for (var i = 0; i < 10; i++) {
    input_string += (str_ops[r_in_r(0,str_ops.length-1)]);
  }
  cur_seed = input_string;
  chance = new Chance(input_string);
}

function new_layer() {
  if (adding_time) {
    clearTimeout(adding_time)
  }
  if (draw_tim) {
    clearTimeout(draw_tim);
  }
  gen_circles();
  draw_circle();
}

function new_drawing(reset_center) {
  if (draw_interval) {
    clearInterval(draw_interval);
  }
  seed_tha_thing();
  init_vars();
  if (reset_center) {
    cur_x = Math.round(max_width / 2);
    cur_y = Math.round(max_height / 2);
  }
  init_canv();
  setTimeout(new_layer,1);
}

function init() {
  color_bw = (r_in_r(0,1) == 0);
  new_drawing(true);
  canv.addEventListener('click',function (mouse_ev) {
    console.log(mouse_ev);
    cur_x = mouse_ev.clientX * ratio_mult;
    cur_y = mouse_ev.clientY * ratio_mult;
    new_drawing(false);
  });
  canv.addEventListener('mousemove',function (mouse_ev) {
    keep_adding = false;
    setTimeout(function () {
      cur_x = mouse_ev.pageX * ratio_mult;
      cur_y = mouse_ev.pageY * ratio_mult;
      gen_more_circles();
    }, 1);
  });
  setInterval(function () {
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0,0,canv.width,canv.height);
  }, 70);
  // setInterval(function () {
  //   stackBlurCanvasRGB("canvas", 0, 0, canv.width, canv.height, 1);
  // }, 300);
}

window.onload = init;
window.onresize = function () {
  new_drawing(true);
};
