var canv;
var ctx;
var maxWidth;
var maxHeight;
const CANV_SHARP = 4;

var dbClickActivated = false;
var circleDrawInterval;
var circleDrawTimeout;

var circles = {};
var drawingKey;

var mouseDown = false;

var mouseX = 0;
var mouseY = 0;

var overlayHeight;
var overlayWidth;

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 */
var randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

var randKey = () => {
    var ops = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890".split("");
    var key = "";
    do {
        for (var i = 0; i < randInt(5,8); i++) {
            key += ops[randInt(0,ops.length-1)];
        }
    } while (circles[key]);
    return key;
}

var toColorString = (color) => {
    return "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")";
}

var randColor = () => {
    return [randInt(0,255),randInt(0,255),randInt(0,255)];
}

var nextColor = (color) => {
    var maxch = randInt(1,3);
    for (var i = 0; i < color.length; i++) {
        color[i] += randInt(-maxch,maxch);
        if (color[i] > 255) color[i] = 255;
        else if (color[i] < 0) color[i] = 0;
    }
    return color;
}

var drawCircle = (x,y,rad,color) => {
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
}

var redraw = () => {
    ctx.clearRect(0,0,maxWidth+10,maxHeight+10);
    var keyList = Object.keys(circles);
    for (var i = 0; i < keyList.length; i++) {
        drawCircle(circles[keyList[i]].x,circles[keyList[i]].y,circles[keyList[i]].rad,toColorString(circles[keyList[i]].color));
    }
    writeCircles();
}

var modCircle = () => {
    if (drawingKey) {
        circles[drawingKey].color = nextColor(circles[drawingKey].color);
        circles[drawingKey].rad += circles[drawingKey].dif/2;
        // invert growth if needed
        if (circles[drawingKey].rad > 99 || circles[drawingKey].rad < 5) {
            circles[drawingKey].dif *= -1;
        }
        circles[drawingKey].x = mouseX;
        circles[drawingKey].y = mouseY;
        redraw();
    }
}

var startCircle = (ev) => {
    if (ev.buttons == 1) {
        mouseDown = true;
        circleDrawTimeout = setTimeout(function () {
            if (!dbClickActivated) {
                drawingKey = randKey();
                var xCoord = ev.clientX;
                var yCoord = ev.clientY;
                var color = randColor();
                circles[drawingKey] = {
                    x:xCoord,
                    y:yCoord,
                    color:color,
                    rad:5,
                    dif:1
                }
                circleDrawInterval = setInterval(modCircle, 1);
            }
        }, 100);
    }
}

var moveCircle = (ev) => {
    mouseX = ev.clientX;
    mouseY = ev.clientY;

}

var finishCircle = () => {
    mouseDown = false;
    clearTimeout(circleDrawTimeout);
    clearInterval(circleDrawInterval);
    drawingKey = null;
}

var getDist = (x1,y1,x2,y2) => {
    var a = x1 - x2;
    var b = y1 - y2;
    return Math.sqrt( (a*a) + (b*b) );
}

var removeCircle = (ev) => {
    dbClickActivated = true;
    var xCoord = ev.clientX;
    var yCoord = ev.clientY;

    var p = ctx.getImageData(xCoord, yCoord, 1, 1).data;
    var checkColor = [p[0],p[1],p[2]];
    var keyList = Object.keys(circles);
    for (var i = 0; i < keyList.length; i++) {
        var key = keyList[i];
        if (getDist(xCoord,yCoord,circles[key].x,circles[key].y) < circles[key].rad &&
            checkColor[0] == circles[key].color[0] &&
            checkColor[1] == circles[key].color[1] &&
            checkColor[2] == circles[key].color[2]) {
            delete circles[key];
        }
    }
    redraw();
    setTimeout(function () {
        dbClickActivated = false;
    }, 200);
}

var initCanv = () => {
    maxWidth = window.innerWidth;
    maxHeight = window.innerHeight;
    canv = document.getElementById('canvas');
    canv.height = maxHeight + CANV_SHARP;
    canv.width = maxWidth + CANV_SHARP;
    ctx = canv.getContext("2d");
    canv.addEventListener('mousedown',startCircle);
    document.addEventListener('mouseup',finishCircle);
    document.addEventListener('mousemove',moveCircle);
    canv.addEventListener('dblclick',removeCircle);
}

var closeContact = (ev) => {
    if (ev.target == document.getElementById('overlay')) {
        document.getElementById('overlay').style.height = overlayHeight;
        document.getElementById('overlay').style.width = overlayWidth;
        document.getElementById('overlay').style.left = null;
        document.getElementById('overlay').style.bottom = null;
        document.getElementById('overlay').style.justifyContent = null;
        document.getElementById('overlay').style.cursor = null;
        document.getElementById('contact_info').style = null;
        document.getElementById('contentBox').style = null;
        document.getElementById('main_info').style.display = null;
        document.getElementById('overlay').removeEventListener('click',closeContact);
        setTimeout(function () {
            document.getElementById('main_info').style.opacity = "1";
        }, 500);
    }
}

var openContact = () => {

    document.getElementById('main_info').style.opacity = "0";
    setTimeout(function () {
        document.getElementById('main_info').style.display = "none";
        document.getElementById('overlay').style.height = "100%";
        document.getElementById('overlay').style.width = "100%";
        document.getElementById('overlay').style.left = "0";
        document.getElementById('overlay').style.bottom = "0";
        document.getElementById('contact_info').style.display = "flex";
        document.getElementById('overlay').style.justifyContent = "center";
        setTimeout(function () {
            document.getElementById('contact_info').style.opacity = "1";
        }, 650);
        document.getElementById('overlay').style.cursor = "url('x.png'), auto";
        document.getElementById('contentBox').style.cursor = "auto";
        document.getElementById('overlay').addEventListener('click',closeContact);
    }, 300);

}

function init() {
    initCanv();
    overlayHeight = document.getElementById('overlay').offsetHeight + "px";
    overlayWidth = document.getElementById('overlay').offsetWidth + "px";
    document.getElementById('overlay').style.height = overlayHeight;
    document.getElementById('overlay').style.width = overlayWidth;
    document.getElementById('openContact').addEventListener('click',openContact);
}

window.onload = init;

var resizeTim;

window.onresize = () => {
    maxWidth = window.innerWidth;
    maxHeight = window.innerHeight;
    canv.height = maxHeight + CANV_SHARP;
    canv.width = maxWidth + CANV_SHARP;
    redraw();
    // canv.removeEventListener('mousedown',startCircle);
    // document.removeEventListener('mouseup',finishCircle);
    // document.removeEventListener('mousemove',moveCircle);
    // canv.removeEventListener('dblclick',removeCircle);
    // ctx = null;
    // canv = null;
}

/*******************************************************************************
****************************** Firebase Shit ***********************************
*******************************************************************************/

function writeCircles() {
  database.ref('circles/').set(circles);
}

var config = {
    apiKey: "AIzaSyA0-gbEgsPO9GuVfKlde5wtPQT2u_Fgxxk",
    authDomain: "staging-e40c9.firebaseapp.com",
    databaseURL: "https://staging-e40c9.firebaseio.com/",
};

firebase.initializeApp(config);
var database = firebase.database();

var starCountRef = firebase.database();

database.ref('circles/').on('value', function(snapshot) {
    if (snapshot.val()) {
        circles = snapshot.val();
        redraw();
    }
});
