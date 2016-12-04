var map;
var center;
var defalut_style = [{"elementType":"geometry","stylers":[{"color":"#1c1c1c"}]},{"elementType":"labels","stylers":[{"visibility":"off"}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#212121"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"color":"#757575"},{"visibility":"off"}]},{"featureType":"administrative.country","elementType":"labels.text.fill","stylers":[{"color":"#9e9e9e"}]},{"featureType":"administrative.land_parcel","stylers":[{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"color":"#bdbdbd"}]},{"featureType":"administrative.neighborhood","stylers":[{"visibility":"off"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#181818"}]},{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"color":"#616161"}]},{"featureType":"poi.park","elementType":"labels.text.stroke","stylers":[{"color":"#1b1b1b"}]},{"featureType":"road","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#2c2c2c"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#8a8a8a"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#373737"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#3c3c3c"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry","stylers":[{"color":"#4e4e4e"}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"color":"#616161"}]},{"featureType":"transit","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},{"featureType":"water","stylers":[{"color":"#797979"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#3a3a3a"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#3d3d3d"}]}];
var my_id;
var locs = {
  me: {lat:43.0861,lng:-77.6705},
};
var overlay_hover = false;

var zoom_val = 2;

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 */
function r_in_r(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function initMap() {
  setTimeout(function () {
    console.log("asdf");
    render_map()
  }, 1000);
}

function render_map() {
  // Styles a map in night mode.
  try {
    navigator.geolocation.getCurrentPosition(function(location) {
      locs.you = {lat: location.coords.latitude,lng: location.coords.longitude};
      center = locs.you;
      map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: zoom_val,
        disableDefaultUI: true,
        styles: defalut_style,
        backgroundColor: '#3A3A3A'
      });

      google.maps.event.addListenerOnce(map, 'idle', function(){
        show_page();
      });
      update_locs();
    }, function (error) {
      center = locs.me;
      map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: zoom_val,
        disableDefaultUI: true,
        styles: defalut_style,
        backgroundColor: '#3A3A3A'
      });
      document.getElementById('map').style.height = window.innerHeight + "px !important";
      document.getElementById('map').style.width = window.innerWidth + "px !important";
      google.maps.event.addListenerOnce(map, 'idle', function(){
        setTimeout(function () {
          show_page();
        }, 10);
      });
      update_locs();
    });
  }
  catch (e) {
    center = locs.me;
    map = new google.maps.Map(document.getElementById('map'), {
      center: center,
      zoom: zoom_val,
      disableDefaultUI: true,
      styles: defalut_style,
      backgroundColor: '#3A3A3A'
    });
    document.getElementById('map').style.height = window.innerHeight + "px !important";
    document.getElementById('map').style.width = window.innerWidth + "px !important";
    google.maps.event.addListenerOnce(map, 'idle', function(){
      setTimeout(function () {
        show_page();
      }, 10);
    });
    update_locs();
  }

}

function update_locs() {
  console.log(locs);
  var me_circle = new google.maps.Circle({
    strokeColor: "#ffcc00",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#ffcc00",
    fillOpacity: 0.35,
    map: map,
    center: locs.me,
    radius: 100000
  });
  if (locs.you) {
    var me_circle = new google.maps.Circle({
      strokeColor: "#eeeeee",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#eeeeee",
      fillOpacity: 0.35,
      map: map,
      center: locs.you,
      radius: 100000
    });
  }
}

function go_to_link(element) {
  var links = {
    'linkedin': 'https://www.linkedin.com/in/samkilgus',
    'github': 'https://github.com/returningsam',
    'instagram': 'https://www.instagram.com/returningsam/',
    'resume': window.location.href + 'get_resume'
  }
  window.open(links[element.innerHTML],'_blank');
}

function fill_emael() {
  var username = 'samkilgus';
  var hostname = 'gmail.com';
  var mailtext = username + '@' + hostname ;
  var link_ele = document.createElement('a');
  link_ele.href = 'mailto:' + mailtext;
  link_ele.innerHTML = mailtext;
  document.getElementById('emael').appendChild(link_ele);
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

function show_page() {
  setTimeout(function () {
    resize_overlay();
  }, 100);
  document.getElementById('loader').style.opacity = 0;
  setTimeout(function () {
    document.getElementById('loader').style.display = "none";
  }, 1100);
  document.getElementById('content').style.opacity = "1";
  document.getElementById('link_cont').style.bottom = "60px";
  document.getElementsByTagName('main')[0].style.backgroundColor = "rgba(0,0,0,0)";
  document.getElementById('overlay').addEventListener('mouseover', function () {
    if (!overlay_hover) {
      resize_overlay(true);
      overlay_hover = true;
    }
  });
  document.getElementById('link_cont').addEventListener('mouseover', function () {
    if (!overlay_hover) {
      resize_overlay(true);
      overlay_hover = true;
    }
  });

  document.getElementById('overlay').addEventListener('mouseout', function () {
    if (overlay_hover) {
      resize_overlay(false);
      overlay_hover = false;
    }
  });
  resize_overlay();
  reposition_desc();
  fill_emael();
  window.onresize = function () {
    resize_overlay();
    reposition_desc();
    if (map) {
      map.setCenter(center);
    }
  }
}

window.onload = function () {
  document.getElementById('logo').src = window.location.href + "get_logo";
  document.getElementById('overlay').style.borderBottom = (window.innerWidth*4).toString() + "px solid white";
  document.getElementById('overlay').style.borderLeft = (window.innerHeight*4).toString() + "px solid transparent";;
}
