

var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    // Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';
    // At least Safari 3+: "[object HTMLElementConstructor]"
var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
    // Internet Explorer 6-11
var isIE = /*@cc_on!@*/false || !!document.documentMode;
    // Edge 20+
var isEdge = !isIE && !!window.StyleMedia;
    // Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;
    // Blink engine detection
var isBlink = (isChrome || isOpera) && !!window.CSS;

var i = 100;
var j = 1;
var maxwidth = window.innerWidth;
var maxheight = window.innerHeight;
var maxsize = 10;
var build = true;
var tostop;

var codeLst = ["var i = 80;",
              "var j = 1;",
              "var maxwidth = 5;",
              "var maxheight = 5;",
              "var maxsize = 10;",
              "var build = true;",
              "var tostop;",
              "var loopchar = function () {",
              "tostop = setInterval(newchar, 100);",
              "}",
              "function getRandomColor() {",
              "var letters = '0123456789ABCDEF'.split('');",
              "var color = '#';",
              "for (var i = 0; i < 6; i++ ) {",
              "color += letters[Math.floor(Math.random() * 16)];",
              "}",
              "return color;",
              "}",
              "function newchar() {",
              "i--;",
              "if (i < 1) {",
              "var torem1 = document.getElementById('box');",
              "var torem2 = document.getElementById('loading');",
              "if (torem1 && torem2) {",
              "torem1.style.display = 'none';",
              "torem2.style.display = 'none';",
              "}",
              "clearInterval(tostop);",
              "}",
              "else{",
              "if (i == 20) {",
              "document.getElementById('tot').style.opacity = '1';",
              "document.getElementById('tot').className += ' fade_in';",
              "}",
              "maxsize += maxsize/10;",
              "if (maxwidth < window.innerWidth) {",
              "maxwidth = maxwidth * 1.2;",
              "}",
              "if (maxheight < window.innerWidth) {",
              "maxheight = maxheight * 1.17;",
              "}",
              "for (var d = 0; d < j; d++) {",
              "var newp = document.createElement('p');",
              "x = 33;",
              "y = 127;",
              "r = Math.floor(Math.random() * ((y - x) + 1) + x);",
              "newp.innerHTML = String.fromCharCode(r);",
              "newp.className += 'newp';",
              "var randomtop = Math.floor(Math.random() * maxheight + 30) - 300;",
              "var randomleft = Math.floor(Math.random() * maxwidth + 10) - 150;",
              "newp.style.zIndex = 0;",
              "newp.style.marginTop = randomtop.toString() + 'px';",
              "newp.style.marginLeft = randomleft.toString() + 'px';",
              "newp.style.fontSize = (Math.floor(Math.random()*maxsize)+10).toString() + 'px';",
              "}",
              "if (build === true) {",
              "j = j+2;",
              "};",
              "loopchar()"];

var loopchar = function () {
  if (isChrome) {
    document.getElementById("box").style.display = "none";
    tostop = setInterval(newcharChrome, 50);
  }
  else{
    document.getElementById("boxchrome").style.display = "none";
    tostop = setInterval(newchar, 50);
  }
};

var PIXEL_RATIO = (function () {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
})();

var stopbuild = false;

var lskdf = 0;
function newchar() {
  i--;
  if (i === 1) {
    document.getElementById("boxchrome").style.display = "none";
    document.getElementById("box").style.display = "none";
    clearInterval(tostop);
  }
  else{
    if (i === 25) {
      stopbuild = true;
      document.getElementById("tot").style.opacity = "1";
      document.getElementById("tot").className += " fade_in";
      document.getElementById("replay").style.opacity = "1";
      document.getElementById("replay").className += " fade_in";
      document.getElementById("soundcloud").style.opacity = "1";
      document.getElementById("soundcloud").className += " fade_in";
      document.getElementById("codelines").style.opacity = "1";
      document.getElementById("codelines").className += " fade_in";
    }

    maxsize += maxsize/20;

    for (var d = 0; d < Math.floor(j); d++) {
      r = codeLst[Math.floor(randomChars1[lskdf] * codeLst.length)];
      lskdf++;
      var randomtop = Math.floor(randomChars1[lskdf] * maxheight+20);
      lskdf++;
      var randomleft = Math.floor(randomChars2[lskdf] * maxwidth)-100;
      lskdf++;
      var randomsize = Math.floor(randomChars2[lskdf]*maxsize) + 5;
      lskdf++;
      var newp = canvas.getContext("2d");
      newp.font = (randomsize*PIXEL_RATIO).toString() + "px Arial";
      newp.fillText(r,randomleft,randomtop);
    }

    if (build === true) {
      j = j + 0.4;
    }
  }
};

function newcharChrome() {
  i--;
  if (i === 1) {
    document.getElementById("boxchrome").style.display = "none";
    document.getElementById("box").style.display = "none";
    clearInterval(tostop);
  }
  else{
    if (i === 25) {
      stopbuild = true;
      document.getElementById("tot").style.opacity = "1";
      document.getElementById("tot").className += " fade_in";
      document.getElementById("replay").style.opacity = "1";
      document.getElementById("replay").className += " fade_in";
      document.getElementById("soundcloud").style.opacity = "1";
      document.getElementById("soundcloud").className += " fade_in";
      document.getElementById("codelines").style.opacity = "1";
      document.getElementById("codelines").className += " fade_in";
    }

    maxsize += maxsize/20;

    for (var d = 0; d < j; d++) {
      var newp = document.createElement("p");
      r = Math.floor(randomChars1[lskdf] * codeLst.length);
      lskdf++;
      newp.innerHTML = codeLst[r];
      newp.className += "newp";
      var randomtop = Math.floor(randomChars1[lskdf] * maxheight + 30) - 200;
      lskdf++;
      var randomleft = Math.floor(randomChars2[lskdf] * maxwidth ) - 500;
      newp.style.zIndex = 0;
      newp.style.marginTop = randomtop.toString() + "px";
      newp.style.marginLeft = randomleft.toString() + "px";

      newp.style.fontSize = (Math.floor(randomChars2[lskdf]*maxsize)+10).toString() + "px";
      lskdf++;
      document.getElementById("boxchrome").appendChild(newp);
    }

    if (build === true) {
      j = j + 0.1;
    }
  }
};

var canvas;
var randomChars1 = [];
var randomChars2 = [];
window.onload = function() {
  var username = "samkilgus";
  var hostname = "gmail.com";
  var mailtext = username + "@" + hostname ;
  document.getElementById("emale").innerHTML = mailtext;
  if (document.cookie.indexOf("6546545665656565124984897289489435465") === -1) {
    document.getElementById("bodeee").style.backgroundColor = "white";
    document.cookie="6546545665656565124984897289489435465=1";
    canvas = document.getElementById("box");
    canvas.width = document.getElementById('bodeee').clientWidth;
    canvas.height = document.getElementById('bodeee').clientHeight;
    for (var d = 0; d < 10000000; d++) {
      randomChars1[d] = Math.random();
      randomChars2[d] = Math.random();
    }
    loopchar();
  }
  else {
    document.getElementById("box").style.display = "none";
    document.getElementById("boxchrome").style.display = "none";
    document.getElementById("tot").style.opacity = "1";
    document.getElementById("tot").className += " fade_in";
    document.getElementById("soundcloud").style.opacity = "1";
    document.getElementById("soundcloud").className += " fade_in";
    document.getElementById("codelines").style.opacity = "1";
    document.getElementById("codelines").className += " fade_in";
    document.getElementById("replay").style.opacity = "1";
    document.getElementById("replay").className += " fade_in";
  }
  var f = Math.floor(Math.random()*4);
  if (f == 0) {
    document.getElementById("soundcloud").style.top = (Math.random()*(document.getElementById('bodeee').clientHeight / 3)).toString() + "px";
    document.getElementById("soundcloud").style.left = (Math.random()*(document.getElementById('bodeee').clientWidth / 3)).toString() + "px";
  }
  else if (f == 1){
    document.getElementById("soundcloud").style.top = (Math.random()*(document.getElementById('bodeee').clientHeight / 3)).toString() + "px";
    document.getElementById("soundcloud").style.right = (Math.random()*(document.getElementById('bodeee').clientWidth / 3)).toString() + "px";
  }
  else if (f == 1){
    document.getElementById("soundcloud").style.bottom = (Math.random()*(document.getElementById('bodeee').clientHeight / 3)).toString() + "px";
    document.getElementById("soundcloud").style.left = (Math.random()*(document.getElementById('bodeee').clientWidth / 3)).toString() + "px";
  }
  else {
    document.getElementById("soundcloud").style.bottom = (Math.random()*(document.getElementById('bodeee').clientHeight / 3)).toString() + "px";
    document.getElementById("soundcloud").style.right = (Math.random()*(document.getElementById('bodeee').clientWidth / 3)).toString() + "px";
  }
  var c = Math.floor(Math.random()*4);
  if (c == 0) {
    document.getElementById("codelines").style.top = (Math.random()*(document.getElementById('bodeee').clientHeight / 3)).toString() + "px";
    document.getElementById("codelines").style.left = (Math.random()*(document.getElementById('bodeee').clientWidth / 3)).toString() + "px";
  }
  else if (c == 1){
    document.getElementById("codelines").style.top = (Math.random()*(document.getElementById('bodeee').clientHeight / 3)).toString() + "px";
    document.getElementById("codelines").style.right = (Math.random()*(document.getElementById('bodeee').clientWidth / 3)).toString() + "px";
  }
  else if (c == 2){
    document.getElementById("codelines").style.bottom = (Math.random()*(document.getElementById('bodeee').clientHeight / 3)).toString() + "px";
    document.getElementById("codelines").style.left = (Math.random()*(document.getElementById('bodeee').clientWidth / 3)).toString() + "px";
  }
  else{
    document.getElementById("codelines").style.bottom = (Math.random()*(document.getElementById('bodeee').clientHeight / 3)).toString() + "px";
    document.getElementById("codelines").style.right = (Math.random()*(document.getElementById('bodeee').clientWidth / 3)).toString() + "px";
  }

};
