const RATIO_MULT = 2;
var canv;
var ctx;

var mouseX;
var mouseY;
var mouseChanged = false;

const NUM_BLOB_POINTS = 10000;

const MIN_DIST = 1;
const MAX_DIST = 3000;

const MAX_DIST_DIFF = 10;
const MAX_DIST_DIFF_DIFF = 2;


var blob;

function randInt(min,max) {return chance.integer({min: min, max: max});}

function randFloat(min,max) {return chance.floating({min: min, max: max});}

function restictRange(min,val,max) {return Math.max(min,Math.min(max,val));}

function updateMousePos(ev) {
    if (mouseX != ev.clientX * RATIO_MULT || mouseY != ev.clientY * RATIO_MULT) {
        mouseX = ev.clientX * RATIO_MULT;
        mouseY = ev.clientY * RATIO_MULT;
        mouseChanged = true;
    }
}

function newPoint(deg,dist) {
    var x = (Math.cos(deg * Math.PI / 180) * dist)+1000;
    var y = (Math.sin(deg * Math.PI / 180) * dist)+1000;
    return [x-1000,y-1000];
}

function genBlob() {
    var maxDegDiff = 360 / NUM_BLOB_POINTS;
    var remDefDiff = 0;
    var curDeg;
    var curDist;
    var curDistDiff;

    var points = [];

    for (var i = 0; i < NUM_BLOB_POINTS; i++) {
        if (!curDeg) curDeg = randFloat(0,360);
        else {
            var curMaxDegDiff = maxDegDiff + remDefDiff;
            var curDegDiff = randFloat(curMaxDegDiff/10,curMaxDegDiff);
            remDefDiff += maxDegDiff - curDegDiff;
            curDeg += curDegDiff;
            if (curDeg > 360) curDeg -= 360;
        }

        if (!curDist) curDist = randFloat(MIN_DIST,MIN_DIST * MIN_DIST);
        else {
            if (!curDistDiff) curDistDiff = randFloat(-MAX_DIST_DIFF,MAX_DIST_DIFF);
            else {
                curDistDiff += randFloat(-MAX_DIST_DIFF_DIFF,MAX_DIST_DIFF_DIFF);
                curDistDiff = restictRange(-MAX_DIST_DIFF,curDistDiff,MAX_DIST_DIFF);
            }
            curDist += curDistDiff;
            curDist = Math.max(MIN_DIST,Math.min(MAX_DIST,curDist));
        }

        points.push([curDeg,curDist]);
    }
    blob = points;
}

function changeBlob() {
    for (var i = 0; i < blob.length; i++) {
        blob[i][0] += randFloat(-MAX_DIST_DIFF_DIFF,MAX_DIST_DIFF_DIFF);
        blob[i][1] += randFloat(-MAX_DIST_DIFF_DIFF,MAX_DIST_DIFF_DIFF);

        if (blob[i][1] < 0) {
            blob[i][1] = restictRange(-MAX_DIST,blob[i][1],-MIN_DIST);
        }
        else {
            blob[i][1] = restictRange(MIN_DIST,blob[i][1],MAX_DIST);
        }
    }
}

function drawBlob() {
    ctx.beginPath();
    ctx.moveTo(mouseX + blob[0][0],mouseY + blob[0][1]);
    for (var i = 1; i < blob.length; i++) {
        var point = newPoint(blob[i][0],blob[i][1]);
        ctx.lineTo(mouseX + point[0],mouseY + point[1]);
    }
    ctx.lineTo(mouseX + blob[0][0],mouseY + blob[0][1]);
    ctx.stroke();
    ctx.closePath();
}

function drawCirc(x,y) {
    ctx.beginPath();
    ctx.arc(x,y,5,0,2*Math.PI);
    ctx.fill();
    ctx.closePath();
}

function drawBlobPoints() {
    for (var i = 1; i < blob.length; i++) {
        var point = newPoint(blob[i][0],blob[i][1]);
        drawCirc(mouseX + point[0],mouseY + point[1])
    }
}

function initCanv() {
    canv = document.getElementById("canvas");
    canv.addEventListener("mousemove",updateMousePos);
    ctx = canv.getContext("2d");

    canv.width  = window.innerWidth  * RATIO_MULT;
    canv.height = window.innerHeight * RATIO_MULT;
}

function frame() {
    mouseChanged = false;
    ctx.clearRect(0,0,canv.width,canv.height);
    // genBlob();
    if (!blob) genBlob();
    else changeBlob();
    drawBlob();
}

function init() {
    initCanv();
    frame();
    setInterval(frame, 50);
    // setInterval(function () {
    //     blob = null;
    // }, 1000);
}

window.onload = init;
