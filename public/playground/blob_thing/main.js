const RATIO_MULT = 2;
var canv;
var ctx;

var mouseX;
var mouseY;
var mouseChanged = false;

const NUM_BLOB_POINTS = 1000;

const MIN_INIT_DIST = 1;
const MAX_INIT_DIST = 1000;

const MAX_PBUFFER_LEN = 2;

const MAX_ANIM_STEP = 10;

var curPoints;
var nextPoints;
var pointsBuffer;

var curAnimStep = 0;
var animInterval;

Number.prototype.mod = function(n) {return ((this%n)+n)%n;};

function randInt(min,max) {return chance.integer({min: min, max: max});}

function randFloat(min,max) {return chance.floating({min: min, max: max});}

function updateMousePos(ev) {
    if (mouseX != ev.clientX * RATIO_MULT || mouseY != ev.clientY * RATIO_MULT) {
        mouseX = ev.clientX * RATIO_MULT;
        mouseY = ev.clientY * RATIO_MULT;
        mouseChanged = true;
    }
}

function polarToCord(a,r) {
    var x = r * Math.cos(a);
    var y = r * Math.sin(a);
    return [x,y];
}

function newPoint() {
    var a = randFloat(0,2 * Math.PI);
    var r = randFloat(MIN_INIT_DIST,MAX_INIT_DIST);
    return [a,r];
}

function genPoints() {
    newPoints = [];
    for (var i = 0; i < NUM_BLOB_POINTS; i++) {
        newPoints.push(newPoint());
    }
    newPoints.sort(function (a,b) {
        return a[0] - b[0];
    });
    return newPoints;
}

function smoothPoints(p,d) {
    for (var i = 0; i < p.length; i++) {
        var avg = 0;
        for (var j = i-d; j < i+d+1; j++) {
            if (j != i) {
                var ind = j.mod(p.length);
                avg += p[ind][1];
            }
        }
        p[i][1] = (avg/(d*2));
    }
}

function drawLine(p) {
    var initPoint = p[p.length-1];
    var coord = polarToCord(initPoint[0],initPoint[1]*dr);
    ctx.beginPath();
    ctx.moveTo(mouseX + coord[0],mouseY + coord[1]);
    for (var i = 0; i < p.length; i++) {
        var coord = polarToCord(p[i][0],p[i][1]*dr);
        ctx.lineTo(mouseX + coord[0],mouseY + coord[1]);
    }
    ctx.stroke();
    ctx.closePath();
}

function fillShape(p,dr) {
    var initPoint = p[p.length-1];
    var coord = polarToCord(initPoint[0],initPoint[1]*dr);
    ctx.beginPath();
    ctx.moveTo(mouseX + coord[0],mouseY + coord[1]);
    for (var i = 0; i < p.length; i++) {
        var coord = polarToCord(p[i][0],p[i][1]*dr);
        ctx.lineTo(mouseX + coord[0],mouseY + coord[1]);
    }
    ctx.fill();
    ctx.closePath();
}

function drawPoints(p) {
    for (var i = 0; i < p.length; i++) {
        var point = p[i];
        var coord = polarToCord(point[0],point[1]*dr);
        drawCirc((canv.width/2) + coord[0],(canv.height/2) + coord[1]);
    }
}

function drawCirc(x,y) {
    ctx.beginPath();
    ctx.arc(x,y,5,0,2*Math.PI);
    ctx.fill();
    ctx.closePath();
}

function frame(points) {
    ctx.clearRect(0,0,canv.width,canv.height);
    var numLayers = 50;
    for (var i = 0; i < numLayers; i++) {
        var rgb = (255 * ((Math.pow(i,1.1))/numLayers));
        rgb -= rgb.mod(1);
        ctx.fillStyle = "rgb(" + rgb + "," + rgb + "," + rgb + ")";
        fillShape(points,1-(i/numLayers));
    }
}

function animStep() {
    // console.log((Math.abs((MAX_ANIM_STEP/2)-curAnimStep)/9));
    curAnimStep += (Math.abs((MAX_ANIM_STEP/2)-curAnimStep+8)/9) + 0.1;

    var animPoints = [];
    for (var i = 0; i < curPoints.length; i++) {
        var na = curPoints[i][0] + ((nextPoints[i][0] - curPoints[i][0])*(curAnimStep/MAX_ANIM_STEP));
        var nr = curPoints[i][1] + ((nextPoints[i][1] - curPoints[i][1])*(curAnimStep/MAX_ANIM_STEP));
        animPoints.push([na,nr]);
    }

    frame(animPoints);

    if (curAnimStep > MAX_ANIM_STEP) {
        clearInterval(animInterval);
        curAnimStep = 0;
        curPoints = nextPoints;
        regenPoints();
    }
}

function regenPoints() {
    if (pointsBuffer.length > 0) {
        nextPoints = pointsBuffer.splice(0,1)[0];
        animInterval = setInterval(animStep, 1);
    }
}

function startBlob() {
    curPoints = pointsBuffer.splice(0,1)[0];
    frame(curPoints);
    regenPoints();
}

function updatePointsBuffer() {
    if (pointsBuffer.length < MAX_PBUFFER_LEN) {
        var newPoints = genPoints();
        for (var i = 0; i < 20; i++) smoothPoints(newPoints,2);
        pointsBuffer.push(newPoints);
    }
}

function initCanv() {
    canv = document.getElementById("canvas");
    ctx = canv.getContext("2d");
    canv.width  = window.innerWidth  * RATIO_MULT;
    canv.height = window.innerHeight * RATIO_MULT;

    if (!mouseX || !mouseY) {
        mouseX = canv.width/2;
        mouseY = canv.height/2;
    }
}

function init() {
    initCanv();
    pointsBuffer = [];
    setInterval(updatePointsBuffer, 10);
    setTimeout(startBlob, 100);
    document.body.addEventListener("mousemove",updateMousePos);
}

window.onload = init;
