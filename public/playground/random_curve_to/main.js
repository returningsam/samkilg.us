const RATIO_MULT = 2;

const MAX_VECT = 20;
const MAX_RAND_VECT_DIFF = 8;
const MAX_FIND_VECT_DIFF = 10;

const BORDER_MARGIN = 100;

var canv;
var ctx;

var points;
var curPoint;

var curPos;
var curVect;
var curDist;
var distLeft;

function randInt(min,max) {return chance.integer({min: min, max: max});}

function randFloat(min,max) {return chance.floating({min: min, max: max});}

function rr(min,max,val) {
    return Math.min(max,Math.max(min,val));
}

function getDist(x1,y1,x2,y2) {
    var a = x1 - x2;
    var b = y1 - y2;
    return Math.sqrt((a*a)+(b*b));
}

function updateVect() {
    var percRandom = distLeft / curDist;
    percRandom = rr(0,1.99,percRandom);
    if (percRandom > 1) percRandom -= ((percRandom % 1)*2);
    // console.log(percRandom);

    var randDiff = [randFloat(-MAX_RAND_VECT_DIFF,MAX_RAND_VECT_DIFF),
                    randFloat(-MAX_RAND_VECT_DIFF,MAX_RAND_VECT_DIFF)];


    var diffx = points[curPoint+1][0] - curPos[0];
    var diffy = points[curPoint+1][1] - curPos[1];
    var tot = Math.abs(diffx) + Math.abs(diffy);
    var findDiff = [(diffx/tot) * MAX_FIND_VECT_DIFF, (diffy/tot) * MAX_FIND_VECT_DIFF];
    if (diffx < MAX_FIND_VECT_DIFF) findDiff[0] = diffx;
    if (diffy < MAX_FIND_VECT_DIFF) findDiff[1] = diffy;

    curVect[0] = rr(-MAX_VECT, MAX_VECT, curVect[0] + ((percRandom * (randDiff[0]))+((1-percRandom) * (findDiff[0]))));
    curVect[1] = rr(-MAX_VECT, MAX_VECT, curVect[1] + ((percRandom * (randDiff[1]))+((1-percRandom) * (findDiff[1]))));
}

var frameInterval;

function frame() {
    distLeft = getDist(curPos[0],curPos[1],points[curPoint+1][0],points[curPoint+1][1]);
    updateVect();
    ctx.beginPath();
    ctx.moveTo(curPos[0],curPos[1]);
    curPos[0] = curPos[0] + curVect[0];
    curPos[1] = curPos[1] + curVect[1];
    ctx.lineTo(curPos[0],curPos[1]);
    ctx.stroke();
    ctx.closePath();
    // console.log("distLeft: " + distLeft);
    if (distLeft < 10) {
        clearInterval(frameInterval);
        var newPoint = [randFloat(BORDER_MARGIN,canv.width-BORDER_MARGIN-1),randFloat(BORDER_MARGIN,canv.height-BORDER_MARGIN-1)];
        // drawCirc(newPoint[0],newPoint[1]);
        points.push(newPoint);
        points.splice(0,1);
        frameInterval = setInterval(frame, 1);
    }
}

function startLine() {
    curPoint = 0;
    curPos = points[curPoint];
    var initdx = (points[curPoint+1][0] - points[curPoint][0])/10;
    var initdy = (points[curPoint+1][1] - points[curPoint][1])/10;
    curVect = [initdx,initdy];
    curDist = getDist(points[curPoint][0],points[curPoint][1],points[curPoint+1][0],points[curPoint+1][1]);

    frameInterval = setInterval(frame, 10);
}

function drawCirc(x,y) {
    ctx.beginPath();
    ctx.arc(x,y,25,0,2*Math.PI);
    ctx.fill();
    ctx.closePath();
}

function drawPoints() {
    for (var i = 0; i < points.length; i++) {
        drawCirc(points[i][0],points[i][1]);
    }
}

function initPoints() {
    points = [];
    points.push([randFloat(BORDER_MARGIN,canv.width-BORDER_MARGIN-1),randFloat(BORDER_MARGIN,canv.height-BORDER_MARGIN-1)]);
    points.push([randFloat(BORDER_MARGIN,canv.width-BORDER_MARGIN-1),randFloat(BORDER_MARGIN,canv.height-BORDER_MARGIN-1)]);
}

function initCanv() {
    canv = document.getElementById("canvas");
    ctx = canv.getContext("2d");

    canv.width  = window.innerWidth  * RATIO_MULT;
    canv.height = window.innerHeight * RATIO_MULT;

    // ctx.lineWidth = 2 * RATIO_MULT;
}

function init() {
    initCanv();
    initPoints();
    // drawPoints();
    startLine();
    // document.body.addEventListener("click",frame);
}

window.onload = init;
