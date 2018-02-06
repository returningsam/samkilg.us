const RATIO_MULT = 2;

const MAX_VECT = 20;
const MAX_RAND_VECT_DIFF = 8;
const MAX_FIND_VECT_DIFF = 10;

const BORDER_MARGIN = (Math.min(window.innerHeight,window.innerWidth)*0.15) * RATIO_MULT;
const NEAR_DIST = 10;

var canv;
var ctx;

var points;
var curPoint;

var curPos;
var curVect;
var curDist;
var distLeft;

var fill = true;
var stroke = true;
var pause = false;

function mobileAndTabletcheck() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

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
    if (!pause) {
        distLeft = getDist(curPos[0],curPos[1],points[curPoint+1][0],points[curPoint+1][1]);
        updateVect();

        curPos[0] = curPos[0] + curVect[0];
        curPos[1] = curPos[1] + curVect[1];
        ctx.lineTo(curPos[0],curPos[1]);
        if (stroke) ctx.stroke();
        // console.log("distLeft: " + distLeft);
        if (distLeft < NEAR_DIST) {
            restartLine();
        }
    }
}

function restartLine() {
    ctx.fillStyle = chance.color({format: 'rgb'});
    if (fill) ctx.fill();
    ctx.closePath();
    clearInterval(frameInterval);
    var newPoint = [randFloat(BORDER_MARGIN,canv.width-BORDER_MARGIN-1),randFloat(BORDER_MARGIN,canv.height-BORDER_MARGIN-1)];
    // drawCirc(newPoint[0],newPoint[1]);
    points.push(newPoint);
    points.splice(0,1);
    ctx.beginPath();
    ctx.moveTo(curPos[0],curPos[1]);
    frameInterval = setInterval(frame, 5);
}

function startLine() {
    curPoint = 0;
    curPos = points[curPoint];
    var initdx = (points[curPoint+1][0] - points[curPoint][0])/10;
    var initdy = (points[curPoint+1][1] - points[curPoint][1])/10;
    curVect = [initdx,initdy];
    curDist = getDist(points[curPoint][0],points[curPoint][1],points[curPoint+1][0],points[curPoint+1][1]);
    ctx.beginPath();
    ctx.moveTo(curPos[0],curPos[1]);
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

function restartDraw() {
    ctx.clearRect(0,0,canv.width,canv.height);
    clearInterval(frameInterval);
    pause = false;
    initPoints();
    startLine();
}

function toggleHandler(ev) {
    var key = ev.key;
    console.log(key);
    switch (key.toLowerCase()) {
        case " ": // toggle pause
            pause = !pause;
            break;
        case "f": // toggle fill
            fill = !fill;
            break;
        case "s": // toggle stroke
            stroke = !stroke;
            break;
        default:

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

    ctx.lineWidth = 2 * RATIO_MULT;
}

function init() {
    initCanv();
    initPoints();
    // drawPoints();
    startLine();
    document.body.addEventListener("click",restartDraw);
    document.body.addEventListener("keydown",toggleHandler);
    if (!mobileAndTabletcheck()) {
        setTimeout(function () {
            document.getElementById("instructions").removeAttribute("style");
        }, 3000);
    }
    else {
        document.getElementById("instructions").style.display = 0;
    }
}

window.onload = init;
