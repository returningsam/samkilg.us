var content = [
  "var canv;",
  "var ctx;",
  "var max_size = 10;",
  "var min_size = 10;",
  "var size_inc = 2;",
  "var num_at_a_time = 1;",
  "var num_at_a_time_inc = 0.1;",
  "var cur_time = 200;",
  "var time_to_sub = 10;",
  "var text_fill_interval;",
  "var keep_filling = true;",
  "function r_in_r(min, max) {",
  "}",
  "function put_text() {",
  "console.log('put_text');",
  "for (var i = 0; i < Math.floor(num_at_a_time); i++) {",
  "var text = content[r_in_r(0,content.length-1)];",
  "var pos_x = r_in_r(-200,canv.width);",
  "var pos_y = r_in_r(-50,canv.height+50);",
  "ctx.font = font;",
  "ctx.fillText(text,pos_x,pos_y);",
  "}",
  "num_at_a_time += num_at_a_time_inc;",
  "max_size += size_inc;",
  "size_inc += 0.01;",
  "if (cur_time > 100) {",
  "cur_time -= time_to_sub;",
  "}",
  "else if (cur_time > 50) {",
  "time_to_sub = 5;",
  "cur_time -= time_to_sub;",
  "}",
  "else if (cur_time > 10) {",
  "time_to_sub = 1;",
  "cur_time -= time_to_sub;",
  "}",
  "else {",
  "cur_time = 5;",
  "}",
  "if (keep_filling) {",
  "setTimeout(put_text,cur_time);",
  "}",
  "function text_fill() {",
  "setTimeout(put_text,cur_time);",
  "setTimeout(function () {",
  "keep_filling = false;",
  "show_main();",
  "},7000)",
  "function open_link(choice) {",
  "window.open(links[choice],'_blank');",
  "function show_main() {",
  "var main = document.getElementsByTagName('main')[0];",
  "main.className = 'row center main_shown';",
  "function fill_emael() {",
  "var username = 'samkilgus';",
  "var hostname = 'gmail.com';",
  "var mailtext = username + '@' + hostname;",
  "var link_ele = document.createElement('a');",
  "link_ele.href = 'mailto:' + mailtext;",
  "link_ele.innerHTML = mailtext;",
  "document.getElementById('emael').appendChild(link_ele);",
  "function page_setup() {",
  "canv = document.getElementById('canvas');",
  "ctx = canv.getContext('2d');",
  "canv.width = window.innerWidth*2;",
  "canv.height = window.innerHeight*2;",
  "fill_emael();",
  "window.onload = function () {",
  "page_setup();",
  "show_main()",
  "text_fill();",
  "}"
];

var canv;
var ctx;

var max_size = 10;
var min_size = 10;
var size_inc = 2;
var num_at_a_time = 1;
var num_at_a_time_inc = 0.1;
var cur_time = 200;
var time_to_sub = 10;
var cur_put = 0;

var keep_filling = true;

var links = {
  'linkedin': 'https://www.linkedin.com/in/samkilgus',
  'github': 'https://github.com/returningsam',
  'instagram': 'https://www.instagram.com/returningsam/',
  'resume': 'http://samkilgus.us-east-1.elasticbeanstalk.com/get_resume'
};

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 */
function r_in_r(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function check_for_white() {
  var num_checked = 0;
  pix_data = ctx.getImageData(0,0,canv.width,canv.height);
  for (var i = 0; i < (pix_data.data.length - (pix_data.data.length*0.7)); i+=4) {
    num_checked++;
    if (pix_data.data[i] != 255 ||
        pix_data.data[i+1] != 255 ||
        pix_data.data[i+2] != 255 ||
        pix_data.data[i+3] != 255) {
      return true;
    }
  }
  return false;
}

function put_text() {
  cur_put++;
  for (var i = 0; i < Math.floor(num_at_a_time); i++) {
    var text = content[r_in_r(0,content.length-1)];
    var font = (r_in_r(min_size,max_size)*2).toString() + 'px PT Mono';
    var pos_x = r_in_r(-500,canv.width);
    var pos_y = r_in_r(-50,canv.height+50);
    ctx.font = font;
    ctx.fillText(text,pos_x,pos_y);
  }
  num_at_a_time += num_at_a_time_inc;
  if (num_at_a_time > 5) {
    num_at_a_time_inc = 0;
  }
  max_size += size_inc;
  size_inc += 0.01;

  if (max_size > 150) {
    max_size = 150;
  }

  if (cur_time > 100) {
    cur_time -= time_to_sub;
  }
  else if (cur_time > 50) {
    time_to_sub = 5;
    cur_time -= time_to_sub;
  }
  else if (cur_time > 0) {
    time_to_sub = 1;
    cur_time -= time_to_sub;
  }
  else {
    cur_time = 1;
  }
  if (cur_put % 100 == 0) {
    keep_filling = check_for_white();
  }
  if (keep_filling) {

    setTimeout(put_text,cur_time);
  }
}

function text_fill() {
  setTimeout(put_text,cur_time);
  setTimeout(function () {
    setTimeout(function () {
      keep_filling = false;
    },3000);
    show_main();
  },6000);
}

function open_link(choice) {
  window.open(links[choice],'_blank');
}

function show_main(fast) {
  var main = document.getElementsByTagName('main')[0];
  if (fast) {
    main.className = 'row center main_shown_fast';
  }
  else {
    main.className = 'row center main_shown';
  }
}

function fill_emael() {
  var username = 'Samkilgus';
  var hostname = 'gmail.com';
  var mailtext = username + '@' + hostname ;
  var link_ele = document.createElement('a');
  link_ele.href = 'mailto:' + mailtext;
  link_ele.innerHTML = mailtext;
  document.getElementById('emael').appendChild(link_ele);
}

function page_setup() {
  canv = document.getElementById('canvas');
  ctx = canv.getContext('2d');
  canv.style.width = (window.innerWidth).toString() + 'px';
  canv.style.height = (window.innerHeight).toString() + 'px';
  canv.width = window.innerWidth*2;
  canv.height = window.innerHeight*2;

  fill_emael();
}

function replay_button() {
  cur_put = 0;
  max_size = 10;
  min_size = 10;
  size_inc = 2;
  num_at_a_time = 1;
  num_at_a_time_inc = 0.1;
  cur_time = 200;
  time_to_sub = 10;
  keep_filling = true;
  var main = document.getElementsByTagName('main')[0];
  main.className = 'row center main_hidden';
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0,0,canv.width,canv.height);
  ctx.fillStyle = "#000000"
  text_fill();
}

window.onload = function () {
  page_setup();
  if (document.cookie.indexOf("samkilguscookies_hasvisited=1") < 0) {
    document.cookie="samkilguscookies_hasvisited=1";
    text_fill();
  }
  else {
    show_main(true);
  }

  // send new user notification to personal analytics platform
  var url = "http://cleanalytics.zswyi3k5ep.us-east-1.elasticbeanstalk.com/new_page_view";
  var request = new XMLHttpRequest();
  if (request) {
    request.open('GET',url,true);
    request.send();
  }
}
