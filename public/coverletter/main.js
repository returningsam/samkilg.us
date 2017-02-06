var span_objs = {};

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 */
function r_in_r(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function check_mob() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

function mv_handler (mv_ev) {
  change_objs(Math.floor(mv_ev.pageX),Math.floor(mv_ev.pageY));
}

function tokenize_content() {
  var objs = document.getElementsByTagName('p');
  for (var i = 0; i < objs.length; i++) {

    objs[i].style.width = objs[i].clientWidth + "px";
    objs[i].style.maxWidth = objs[i].clientWidth + "px";
    objs[i].style.height = objs[i].clientHeight + "px";
    objs[i].style.maxHeight = objs[i].clientHeight + "px";

    var content = objs[i].innerHTML;
    tokens = content.split(" ");
    objs[i].innerHTML = "";
    for (var j = 0; j < tokens.length; j++) {
      objs[i].innerHTML += "<span>" + tokens[j] + " </span>";
    }
  }
  var objs = document.getElementsByTagName('h1');
  for (var i = 0; i < objs.length; i++) {

    objs[i].style.width = objs[i].clientWidth + "px";
    objs[i].style.maxWidth = objs[i].clientWidth + "px";
    objs[i].style.height = objs[i].clientHeight + "px";
    objs[i].style.maxHeight = objs[i].clientHeight + "px";

    var content = objs[i].innerHTML;
    tokens = content.split(" ");
    objs[i].innerHTML = "";
    for (var j = 0; j < tokens.length; j++) {
      if (tokens[j] == "Sam") {
        objs[i].innerHTML += "<a href='https://samkilg.us'><span>" + tokens[j] + " " + tokens[j+1] + "</span></a>";
        j++;
      }
      else {
        objs[i].innerHTML += "<div><span>" + tokens[j] + " </span></div>";
      }
    }
  }
  setTimeout(function () {
    get_objects();
    document.body.addEventListener('mousemove',mv_handler);
  }, 10);
}

function get_objects() {
  span_objs = {};
  var objs = document.getElementsByTagName('span');
  for (var i = objs.length-1; i >= 0; i--) {
    var pos = objs[i].getBoundingClientRect();
    var pos_x = Math.floor(objs[i].offsetLeft) + Math.floor(objs[i].clientWidth / 2);
    var pos_y = Math.floor(objs[i].offsetTop) + Math.floor(objs[i].clientHeight / 2);
    objs[i].style.width = objs[i].clientWidth + "px";
    objs[i].style.maxWidth = objs[i].clientWidth + "px";
    objs[i].style.height = objs[i].clientHeight + "px";
    objs[i].style.maxHeight = objs[i].clientHeight + "px";
    // (function () {
    //   objs[i].addEventListener('mouseover', function (click_ev) {
    //     console.log("x: " + click_ev.target.getBoundingClientRect().left);
    //     console.log("y: " + click_ev.target.getBoundingClientRect().top);
    //   });
    // })();
    if (!span_objs[pos_y]) {
      span_objs[pos_y] = {};
    }
    if (!span_objs[pos_y][pos_x]) {
      span_objs[pos_y][pos_x] = {};
    }
    span_objs[pos_y][pos_x].obj = objs[i];
    span_objs[pos_y][pos_x].gl_int = null;
    span_objs[pos_y][pos_x].glitching = false;
    span_objs[pos_y][pos_x].keep_going = true;
  }
}

String.prototype.replaceAt=function(index, character) {
  return this.substr(0, index) + character + this.substr(index+character.length);
}

var timeout_array = [];

function do_glitch(gl_obj,time,depth) {
  if (!gl_obj.glitching) {
    //clearTimeout(gl_obj.gl_int);
    gl_obj.gl_int = setTimeout(function () {
      gl_obj.glitching = true;
      if (!gl_obj.def_text) {
        gl_obj.def_text = gl_obj.obj.innerHTML;
      }
      for (var i = 0; i < r_in_r(1,Math.min(3,gl_obj.obj.innerHTML.length-1)); i++) {
        gl_obj.obj.innerHTML = gl_obj.obj.innerHTML.replaceAt(r_in_r(0,gl_obj.obj.innerHTML.length-1),String.fromCharCode(r_in_r(33,254)));
      }
      timeout_array.push(setTimeout(function () {
        if (gl_obj.def_text) {
          gl_obj.obj.innerHTML = gl_obj.def_text;
        }

        gl_obj.glitching = false;
        if ((depth > 0 && time > 0) && gl_obj.keep_going) {
          do_glitch(gl_obj,time - 20,depth - r_in_r(0,100));
        }
        else {
          if (gl_obj.def_text && gl_obj.def_text != "") {
            gl_obj.obj.innerHTML = gl_obj.def_text;
          }

          gl_obj.glitching = false;
          gl_obj.def_text = null;
          gl_obj.keep_going = true;
        }
      }, r_in_r(90,110)));
    }, Math.max(110,time));
  }
}

function change_objs(mos_x,mos_y) {
  var max_time = 12;
  var max_dif = 150;
  var y_coords = Object.keys(span_objs);

  for (var i = 0; i < y_coords.length; i++) {
    var y = parseInt(y_coords[i]);
    var dif_y = Math.abs(mos_y - y);

    if (span_objs[y]) {
      var x_coords = Object.keys(span_objs[y]);
      for (var j = 0; j < x_coords.length; j++) {
        var x = parseInt(x_coords[j]);
        var dif_x = Math.abs(mos_x - x);

        if (span_objs[y][x]) {
          var time = Math.floor(((dif_x  / max_dif) * max_time) + ((dif_y  / max_dif) * max_time));
          if (time < max_time) {
            time = Math.pow(time,2);
            do_glitch(span_objs[y][x],time,Math.pow(max_time,2) - time);
          }
          else {
            span_objs[y][x].gl_int = null;
            span_objs[y][x].glitching = false;
            setTimeout(function () {
              if (span_objs && span_objs[y] && span_objs[y][x]) {
                if (span_objs[y][x].gl_int) {
                  clearTimeout(span_objs[y][x].gl_int);
                }

                if (span_objs[y][x].def_text) {
                  span_objs[y][x].obj.innerHTML = span_objs[y][x].def_text;
                }
                span_objs[y][x].keep_going = false;
              }
            }, 10);
          }
        }
      }
    }
  }
}

function resize() {
  setTimeout(function () {
    document.body.removeEventListener('mousemove',mv_handler);
    var objs = document.getElementsByTagName('p');
    for (var i = 0; i < objs.length; i++) {
      objs[i].style = null;
    }
    var objs = document.getElementsByTagName('h1');
    for (var i = 0; i < objs.length; i++) {
      objs[i].style = null;
    }
    var objs = document.getElementsByTagName('p');
    for (var i = 0; i < objs.length; i++) {
      objs[i].style.width = objs[i].clientWidth + "px";
      objs[i].style.maxWidth = objs[i].clientWidth + "px";
      objs[i].style.height = objs[i].clientHeight + "px";
      objs[i].style.maxHeight = objs[i].clientHeight + "px";
    }
    var objs = document.getElementsByTagName('h1');
    for (var i = 0; i < objs.length; i++) {
      objs[i].style.width = objs[i].clientWidth + "px";
      objs[i].style.maxWidth = objs[i].clientWidth + "px";
      objs[i].style.height = objs[i].clientHeight + "px";
      objs[i].style.maxHeight = objs[i].clientHeight + "px";
    }
    get_objects();
    document.body.addEventListener('mousemove',mv_handler);
  }, 10);
}

window.onload = function () {
  if (!check_mob()) {
    tokenize_content();
    window.onresize = resize;
  }
  else {
    document.getElementsByTagName("h1")[0].innerHTML = document.getElementsByTagName("h1")[0].innerHTML.replace("Sam Kilgus.", "<a href='https://samkilg.us'>Sam Kilgus.</a>");
  }
}
