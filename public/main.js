var map;
var center;
var defalut_style = [{"elementType":"geometry","stylers":[{"color":"#1c1c1c"}]},{"elementType":"labels","stylers":[{"visibility":"off"}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#212121"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"color":"#757575"},{"visibility":"off"}]},{"featureType":"administrative.country","elementType":"labels.text.fill","stylers":[{"color":"#9e9e9e"}]},{"featureType":"administrative.land_parcel","stylers":[{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"color":"#bdbdbd"}]},{"featureType":"administrative.neighborhood","stylers":[{"visibility":"off"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#181818"}]},{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"color":"#616161"}]},{"featureType":"poi.park","elementType":"labels.text.stroke","stylers":[{"color":"#1b1b1b"}]},{"featureType":"road","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#2c2c2c"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#8a8a8a"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#373737"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#3c3c3c"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry","stylers":[{"color":"#4e4e4e"}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"color":"#616161"}]},{"featureType":"transit","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},{"featureType":"water","stylers":[{"color":"#797979"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#3a3a3a"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#3d3d3d"}]}];
var my_id;
var database;
var db_ready;
var my_loc = {lat:43.08,lng:-77.67}
var locs;
var overlay_hover = false;
var desc_shown = false;

var zoom_val = 3;

var circles = [];

var me_circle;

var hours_to_decay = 48;

var timedout = false;
var page_shown = false;



/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 */
function r_in_r(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gen_id() {
  var ops = "abcdefghijklmnopqrstuvwxyz1234567890".split("");
  var new_id;
  do {
    new_id = "";
    for (var i = 0; i < r_in_r(5,15); i++) {
      new_id += ops[r_in_r(0,ops.length-1)];
    }
  } while (locs[new_id]);
  return new_id;
}

function set_cookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function get_cookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length,c.length);
    }
  }
  return false;
}

function make_map() {
  center = my_loc;
  map = new google.maps.Map(document.getElementById('map'), {
    center: center,
    zoom: zoom_val,
    disableDefaultUI: true,
    styles: defalut_style,
    backgroundColor: '#3A3A3A',
    minZoom: 2
  });

  google.maps.event.addListenerOnce(map, 'idle', show_page);
  update_locs();
}

function initMap() {
  try {
    init_firebase();
  } catch (e) {
      console.log(e);
  }
  render_map();
}

function get_date() {
  var date = new Date();
  return date.toUTCString().replace(" GMT","").replace(" 2016","").replace(" 2017","");
}

function capture_location(location) {
  if (!locs) {
    locs = {};
  }
  var new_loc = {
    loc: {
      lat: parseFloat((location.coords.latitude).toFixed(2)),
      lng: parseFloat((location.coords.longitude).toFixed(2))
    },
    count: 1,
    decay: Math.round(Date.now()/3600000),
    date: get_date()
  };
  var found = false;
  for (var i = 0; i < Object.keys(locs).length; i++) {
    var key = Object.keys(locs)[i];
    if (locs[key] && locs[key].decay == locs[key].decay && locs[key].loc.lat == new_loc.loc.lat && locs[key].loc.lng == new_loc.loc.lng) {
      found = true;
      my_id = key;
      break;
    }
  }
  if (!found) {
    // check cookie for id
    if (get_cookie('samkilgussite') && locs[get_cookie('samkilgussite')]) {
      my_id = get_cookie('samkilgussite');
    }
    else {
      my_id = gen_id();
      set_cookie('samkilgussite',my_id,1);
    }

    locs[my_id] = new_loc;
  }
  else {
    if (get_cookie('samkilgussite') != my_id) {
      locs[my_id].count += 1;
    }
    locs[my_id].decay = Math.round(Date.now()/3600000);
  }
  push_data();

  update_locs();
}

function render_map() {
  try {
    make_map();
    navigator.geolocation.getCurrentPosition(capture_location, update_locs);
  }
  catch (e) {
    update_locs();
  }
}

function update_locs() {

  for (var i = 0; i < circles.length; i++) {
    if (circles[i]) {
      circles[i].setMap(null)
      delete circles[i];
    }
  }
  if (me_circle) {
    me_circle.setMap(null);
    me_circle = null;
  }
  me_circle = new google.maps.Circle({
    strokeColor: "#ffcc00",
    strokeOpacity: 0.85,
    strokeWeight: 2,
    fillColor: "#ffcc00",
    fillOpacity: 0.4,
    map: map,
    center: my_loc,
    radius: 100000,
    clickable: false
  });
  if (locs) {
    for (var i = 0; i < Object.keys(locs).length; i++) {
      var key = Object.keys(locs)[i];
      if (locs[key]) {
        var num_hours = Math.round(Date.now()/3600000)
        var op_mult = (1.0 - (((num_hours - locs[key].decay)/hours_to_decay)));
        op_mult = Math.max(0.4,op_mult);
        var radius = 50000 * locs[key].count;
        var new_circle = new google.maps.Circle({
          strokeColor: "#eeeeee",
          strokeOpacity: 0.85 * op_mult,
          strokeWeight: 2,
          fillColor: "#eeeeee",
          fillOpacity: 0.4 * op_mult,
          map: map,
          center: locs[key].loc,
          radius: radius,
          clickable: false
        });

        circles.push(new_circle);
      }
    }
  }
}

function go_to_link(element) {
  var links = {
    'linkedin': 'https://www.linkedin.com/in/samkilgus',
    'github': 'https://github.com/returningsam',
    'instagram': 'https://www.instagram.com/returningsam/',
    'resume': 'resume.pdf'
  }
  window.open(links[element.innerHTML],'_blank');
}


/**
 * This is to fill in my email after the page loads to hopefully avoid some spam
 * that would come from webcrawlers finding my email in plain text in the source
 * files.
 */
function fill_emael() {
  if (document.getElementById('emael').innerHTML.length < 1) {
    var username = 'samkilgus';
    var hostname = 'gmail.com';
    var mailtext = username + '@' + hostname ;
    var link_ele = document.createElement('a');
    link_ele.href = 'mailto:' + mailtext;
    link_ele.innerHTML = mailtext;
    document.getElementById('emael').appendChild(link_ele);
  }
}

var ratio;

function resize_overlay(extra) {
  ratio = window.innerHeight/window.innerWidth;
  if (ratio > 1.5) {
    ratio = 1.50;
  }
  if (ratio < 0.6) {
    ratio = 0.6;
  }

  if (extra) {
    ratio += 0.05;
  }

  var footer = document.getElementById('overlay');
  var border_left = Math.round((window.innerHeight * ratio));
  var border_bottom = Math.round((window.innerWidth * (1/ratio))-300);

  var shape_ratio = Math.min(border_left/border_bottom,border_bottom/border_left);
  shape_ratio = Math.max(0,shape_ratio);

  border_left = border_left - (300 * shape_ratio);
  border_bottom = border_bottom - (300 * shape_ratio);

  if (border_left < document.getElementById('link_cont').clientWidth + 120) {
    border_left = document.getElementById('link_cont').clientWidth + 120;
  }
  if (border_bottom < document.getElementById('link_cont').clientHeight + 120) {
    border_bottom = document.getElementById('link_cont').clientHeight + 120;
  }

  footer.style.borderBottom = border_bottom.toString() + "px solid white";
  footer.style.borderLeft = border_left.toString() + "px solid transparent";
}

function reposition_desc() {
  var desc = document.getElementById('content');
  desc.style.bottom = Math.max(60,60*Math.pow(ratio+.4,3)).toString() + "px";
}

function fix_hover() {
  document.getElementById('logo_cont').className = "logo_cont_nohover";
  setTimeout(function () {
    document.getElementById('logo_cont').className = "logo_cont";
  }, 10);
  resize_overlay();
  reposition_desc();
}

function push_data() {
  console.log(locs[my_id]);
  firebase.database().ref('locs/'+ my_id + "/").set(locs[my_id]);
}

function show_page() {
  if (page_shown) {
    return;
  }
  page_shown = true;
  setInterval(update_locs, 1800000);

  document.getElementById('loader').style.opacity = 0;
  setTimeout(function () {
    document.getElementById('loader').style.display = "none";
  }, 1100);
  document.getElementById('content').style.opacity = "1";
  document.getElementById('link_cont').style.bottom = "60px";
  document.getElementsByTagName('main')[0].style.backgroundColor = "rgba(0,0,0,0)";
  document.getElementById('link_cont').addEventListener('mouseover', function () {
    if (!overlay_hover) {
      resize_overlay(true);
      overlay_hover = true;
    }
  });

  document.getElementById('link_cont').addEventListener('mouseout', function () {
    if (overlay_hover) {
      resize_overlay();
      overlay_hover = false;
    }
  });

  document.getElementById('logo_cont').addEventListener("mouseup", function () {
    if (desc_shown) {
      document.getElementById('desc_cont').style.opacity = 0;
      document.getElementById('desc_cont').style.pointerEvents = "none";
      desc_shown = false;
    }
    else {
      document.getElementById('desc_cont').style.opacity = 1;
      document.getElementById('desc_cont').style.pointerEvents = "all";
      desc_shown = true;
    }
    fix_hover();
  });
  document.getElementById('desc_cont').addEventListener("mouseup",function (click_ev) {
    if (click_ev.target.localName == "div") {
      document.getElementById('desc_cont').style.opacity = 0;
      document.getElementById('desc_cont').style.pointerEvents = "none";
      desc_shown = false;
      fix_hover();
    }
  });
  resize_overlay();
  reposition_desc();
  fill_emael();
  window.onresize = function () {
    resize_overlay();
    reposition_desc();
  }
  if (fixOverlayInterval) {
    clearInterval(fixOverlayInterval);
  }
  fixOverlayInterval = setInterval(resize_overlay, 1000);
}

var fixOverlayInterval;

eval(function(p,a,c,k,e,d){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--){d[e(c)]=k[c]||e(c)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('0 m(){n 8={o:"p-l",k:"g://f-h.i.j",};2.q(8);1=2.1();2.1().A(\'7/\').B(\'x\',0(a){7=a.s();t()})}3.u=0(){6.5(\'9\').d.C=(3.y*4).e()+"b c z";6.5(\'9\').d.r=(3.v*4).e()+"b c w"}',39,39,'function|database|firebase|window||getElementById|document|locs|config|overlay|snapshot|px|solid|style|toString|samkilgus|https|49192|firebaseio|com|databaseURL|eB0gnzkRUCEe5ZpdAzP8rgQW_SYE8Q|init_firebase|var|apiKey|AIzaSyCg|initializeApp|borderLeft|val|update_locs|onload|innerHeight|transparent|value|innerWidth|white|ref|on|borderBottom'.split('|'),0,{}))
