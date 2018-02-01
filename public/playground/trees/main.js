
function draw_tree(x,y,width) {
  width *= ratio_mult;
  var height = width * r_in_r_f(1.7,2);
  var br_space = 10 * ratio_mult;
  ctx.beginPath();
  ctx.moveTo(x,y);
  // draw trunk
  ctx.lineTo(x,y-height);
  // right branches
  var num_br = Math.floor(height / br_space);
  console.log(num_br);

  var br_end_y = 0;
  var br_end_x = 0;
  var num_left;
  var sw = true;
  for (var i = 0; i <= num_br; i++) {
    ctx.moveTo(x,y - (i * br_space));
    ctx.lineTo(x + br_end_x,y - br_end_y);
    sw = br_end_x < width/2 && sw;
    if (sw) {
      br_end_x += br_space;
      num_left = (num_br - i);
    }
    else {
      br_end_x -= (width/2) / num_left;
      br_end_y += br_space * Math.sqrt(1.8);
    }

  }
  // left branches
  var br_end_y = 0;
  var br_end_x = 0;
  var num_left;
  var sw = true;
  for (var i = 0; i <= num_br; i++) {
    ctx.moveTo(x,y - (i * br_space));
    ctx.lineTo(x - br_end_x,y - br_end_y);
    sw = br_end_x < width/2 && sw;
    if (sw) {
      br_end_x += br_space;
      num_left = (num_br - i);
    }
    else {
      br_end_x -= (width/2) / num_left;
      br_end_y += br_space * Math.sqrt(1.8);
    }

  }
  ctx.stroke();
  ctx.closePath();
  console.log("asdf");
}

function main() {


  var grd = ctx.createLinearGradient(canv.width,canv.height,canv.width,0);
  grd.addColorStop(0,"rgba(255,255,255,0.05)");
  grd.addColorStop(1,"rgba(255,255,255,0.01)");
  ctx.fillStyle = grd;
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1 * ratio_mult;
  var layer_dif = 15 * ratio_mult;
  for (var j = 0; j < layer_dif; j+=0.5) {
    for (var i = 0; i < 10; i++) {
      draw_tree(r_in_r(-100,canv.width+100),canv.height - (20 * (layer_dif - j)) - 50,r_in_r(50,200));
      ctx.fillRect(0,0,canv.width,canv.height);
    }
  }
  grd = null;
  grd = ctx.createLinearGradient(canv.width,canv.height,canv.width,canv.height/3);
  grd.addColorStop(0,"rgba(0,0,0,0.5)");
  grd.addColorStop(1,"rgba(255,255,255,0)");
  ctx.fillStyle = grd;
  ctx.fillRect(0,canv.height/3,canv.width,canv.height)
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var canv;
var ctx;

var max_width;
var max_height;
var ratio_mult = 2;

var chance;
var cur_seed;

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 */
function r_in_r(min, max) {
  return chance.integer({min: min, max: max});
}

/**
 * Returns a random float between min (inclusive) and max (exclusive)
 */
function r_in_r_f(min, max) {
  return Math.random() * (max - min) + min;
}

function rand_color() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
    color += letters[r_in_r(0,letters.length-1)];
  }
  return color;
}

function downloadCanvas(filename) {
  var link = document.createElement('a');
  link.href = document.getElementById('canvas').toDataURL();
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  delete link;
}

function init_vars() {
  max_width = window.innerWidth * ratio_mult;
  max_height = window.innerHeight * ratio_mult;

}

function init_canv() {
  canv = document.getElementById('canvas');
  ctx = canv.getContext('2d');
  ctx.clearRect(0,0,canv.width,canv.height);
  canv.width = max_width;
  canv.height = max_height;
}

function keypress_handler(key_ev) {
  var seed_id = document.getElementById('seed_id')
  if (key_ev.keyCode == 13) {
    new_drawing(seed_id.innerHTML.toString());
  }
  else if (key_ev.keyCode == 8 || key_ev.keyCode == 36) {
    seed_id.innerHTML = seed_id.innerHTML.slice(0,seed_id.innerHTML.length-1);
    seed_id.className = "custom";
  }
  else if (key_ev.keyCode < 91 && key_ev.keyCode > 47) {
    if (seed_id.className == "random") {
      seed_id.className = "custom";
      seed_id.innerHTML = "";
    }
    if (seed_id.innerHTML.length < 13) {
      seed_id.innerHTML = seed_id.innerHTML + key_ev.key;
    }
  }
}

function seed_tha_thing(input_string) {
  if (!input_string) {
    input_string = "";
    var str_ops = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890".split("");
    for (var i = 0; i < 10; i++) {
      input_string += (str_ops[r_in_r(0,str_ops.length-1)]);
    }
    document.getElementById('seed_id').className = "random";
  }
  document.getElementById('seed_id').innerHTML = input_string;
  cur_seed = input_string;
  chance = new Chance(cur_seed);
}

function new_drawing(seed_string) {
  seed_tha_thing(seed_string);
  init_vars();
  init_canv();
  main();
}

function init() {
  new_drawing();
  canv.addEventListener('click',function () {
    new_drawing();
  });
  document.addEventListener('keyup',keypress_handler);
  document.getElementById('download').addEventListener('click', function () {
    downloadCanvas("lines_" + cur_seed + ".png");
  });
}

window.onload = init;
window.onresize = new_drawing;
