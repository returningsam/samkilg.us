/******************************************************************************/
/*************************** HELPERS ******************************************/
/******************************************************************************/

var isMobile;

function checkMobile () {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
}

var dampen = (cur,targ,dmp,min,max) => {
    var dif = Math.abs(targ - cur);
    if (dif == 0) return 0;
    var dir = dif / (targ - cur);
    if (min && dif < min) return dif*dir;
    if (max && dif > max) return max;
    return dir * Math.pow(dif,dmp);
}

/******************************************************************************/
/*************************** CANVAS HELPERS ***********************************/
/******************************************************************************/

function indToCoord(i) {
    i = i/4;
    var x = i%canv.width;
    var y = (i-x)/canv.width;
    return [x,y];
}

function coordToInd(x,y) {
    return (((y*canv.width)+x)*4);
}

function getDist(x1,y1,x2,y2) {
    var a = x1 - x2;
    var b = y1 - y2;
    return Math.sqrt((a*a)+(b*b));
}

function getDir(x1,y1,x2,y2) {
    var a = x1 - x2;
    var b = y1 - y2;
    return [a/Math.abs(a),b/Math.abs(b)];
}

/******************************************************************************/
/*************************** CANVAS ANIMATION *********************************/
/******************************************************************************/

const RATIO_MULT = 1.5;
const MIN_DIST_EXP = 0.8;
var minDist;

var canv;
var ctx;

var mouseX = window.innerWidth/2;
var mouseY = window.innerHeight/3;
var mouseMoved = false;
var curDist;

var canvUpdateInterval;

var allParts;

var usedColors;

var animCenter;

var genPartsWorker;

var genPartsWorkerCallback;

var canvasInteraction = true;

function updateMinDist() {
    minDist = Math.pow(Math.min(window.innerWidth,window.innerHeight),0.8);
}

function genPartsAsync(callback) {
    genPartsWorkerCallback = callback;
    var imageData = ctx.getImageData(0,0,canv.width,canv.height);
    var drawn = false;
    for (var i = 0; i < imageData.data.length; i+=4) {
        if (imageData.data[i+3] > 0) {
            drawn = true;
            break;
        }
    }
    if (!drawn) {
        initContent();
        setTimeout(function () {
            genPartsAsync(callback);
        }, 10);
        return;
    }

    genPartsWorker.postMessage({
        'cmd': 'gen',
        'msg': {
            imageData: imageData,
            canvWidth: canv.width,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight
        }
    });
}

function updateParts() {
    if (!canvasInteraction) return;
    var imgData = ctx.createImageData(canv.width,canv.height);
    for (var i = 0; i < allParts.length; i++) {
        var curPart = allParts[i];
        var curDist = getDist(curPart.center[0],curPart.center[1],focusPoint.x*RATIO_MULT,focusPoint.y*RATIO_MULT) * curPart.m * (focusPoint.push/100);
        if (curDist < minDist) {
            var distMult = 1 - (curDist/minDist);
            var xDelta = Math.floor(curPart.dx*distMult);
            var yDelta = Math.floor(curPart.dy*distMult);

            for (var j = 0; j < curPart.points.length; j++) {
                var curPoint = curPart.points[j];
                var newX = curPoint[0][0] + xDelta;
                var newY = curPoint[0][1] + yDelta;

                if (newX > 0 && newX < canv.width && newY > 0 && newY < canv.height) {
                    var ind = coordToInd(newX,newY);
                    var c = usedColors[curPoint[1]];
                    imgData.data[ind]   = c[0];
                    imgData.data[ind+1] = c[1];
                    imgData.data[ind+2] = c[2];
                    imgData.data[ind+3] = c[3];
                }
            }
            allParts[i].updated = false;
        }
        else {
            for (var j = 0; j < curPart.points.length; j++) {
                var curPoint = curPart.points[j];
                var ind = coordToInd(curPoint[0][0],curPoint[0][1]);
                var c = usedColors[curPoint[1]];
                imgData.data[ind]   = c[0];
                imgData.data[ind+1] = c[1];
                imgData.data[ind+2] = c[2];
                imgData.data[ind+3] = c[3];
            }

            if (!allParts[i].updated) {
                var ddiv = 3.5;
                if (chance.bool()) {
                    allParts[i].dx = chance.integer({min: -window.innerWidth/ddiv, max: window.innerWidth/ddiv});
                    allParts[i].dy = chance.integer({min: -window.innerWidth/ddiv, max: window.innerWidth/ddiv});
                }
                else {
                    allParts[i].dx = chance.integer({min: -window.innerWidth/ddiv, max: window.innerWidth/ddiv});
                    allParts[i].dy = chance.integer({min: -window.innerWidth/ddiv, max: window.innerWidth/ddiv});
                }
                allParts[i].updated = true;
            }
        }
    }
    ctx.clearRect(0,0,canv.width,canv.height);
    ctx.putImageData(imgData,0,0);
}

/******************************************************************************/
/*************************** FOCUS POINT **************************************/
/******************************************************************************/

var focusPoint;
var focusPointEl;
var focusPointUpdateInterval;
var focusPointColor = false;

function updateFocusPoint() {
    var a = Math.abs(mouseX - focusPoint.x);
    var b = Math.abs(mouseY - focusPoint.y);
    var c = (a+b) ? a/(a+b) : 1;
    var d = (a+b) ? b/(a+b) : 1;

    // console.log(c,d);
    focusPoint.x = focusPoint.x + (c*dampen(focusPoint.x,mouseX,0.95,0.1));
    focusPoint.y = focusPoint.y + (d*dampen(focusPoint.y,mouseY,0.95,0.1));
}

function drawFocusPoint() {
    updateFocusPoint();
    focusPointEl.style.left   = (focusPoint.x) + "px";
    focusPointEl.style.top    = (focusPoint.y) + "px";
    focusPointEl.style.height = (focusPoint.r) + "px";
    focusPointEl.style.width  = (focusPoint.r) + "px";
}

function genFocusPoint() {
    focusPoint = {
        x: mouseX,
        y: mouseY,
        push: 100,
        r: 25,
        jitter: 0
    }
}

function initFocusPointEventListeners() {
    var links = document.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        links[i].addEventListener("mouseover",function () {
            focusPointEl.classList.add("link");
        });
        links[i].addEventListener("mouseleave",function () {
            focusPointEl.classList.remove("link");
        });
    }
}

var FPClickAnim;
var FPClickAnimDoFinish = false;
var FPClickAnimDone = true;

function handleGeneralMouseDown() {
    FPClickAnimDone = false;
    if (FPClickAnim) {
        FPClickAnim.pause();
        FPClickAnim = null;
    }
    FPClickAnim = anime({
        targets: focusPoint,
        push: 30,
        r: 35,
        easing: 'easeInOutSine',
        duration: 250,
        complete: function(anim) {
            FPClickAnimDone = true;
            if (!FPClickAnimDoFinish) return;
            FPClickAnimDoFinish = false;
            handleGeneralMouseUp();
        }
    });
}

function handleGeneralMouseUp() {
    if (!FPClickAnimDone) {
        FPClickAnimDoFinish = true;
        return;
    };
    if (FPClickAnim) {
        FPClickAnim.pause();
        FPClickAnim = null;
    }
    FPClickAnimResolve = false;
    FPClickAnim = anime({
        targets: focusPoint,
        push: 100,
        r: 25,
        easing: 'easeInOutSine',
        duration: 500,
    });
}

function initFocusPoint() {
    focusPointEl = document.getElementById("focusPoint");
    if (isMobile) focusPointEl.style.display = "none";
    else {
        genFocusPoint();
        drawFocusPoint();
        focusPointUpdateInterval = setInterval(drawFocusPoint, 10);
        initFocusPointEventListeners();
        document.body.addEventListener("mousedown",handleGeneralMouseDown);
        document.body.addEventListener("mouseup",handleGeneralMouseUp);
    }
}

/******************************************************************************/
/*************************** EVENT HANDLERS ***********************************/
/******************************************************************************/

var curScroll = 0;
var fauxScrollAmt = 1;

function updateMousePos(ev) {
    if (mouseX != ev.clientX || mouseY != ev.clientY) {
        mouseX = ev.clientX;
        mouseY = ev.clientY;
        mouseMoved = true;
    }
}

function updateProjectsCont(delta) {
    fauxScrollAmt += delta;
    var pCont = document.getElementById("projectsCont");
    if (fauxScrollAmt <= 0)
        pCont.style.top = null;
    else pCont.style.top = -fauxScrollAmt + "px";
}

function handleMainScroll(ev) {
    curScroll = document.body.scrollTop;
    var stage1Scroll = document.getElementById("menuCont").clientHeight;
    // console.log(curScroll);
    if (curScroll >= stage1Scroll && fauxScrollAmt > 0) {
        ev.preventDefault();
        updateProjectsCont(ev.deltaY);
    }
    else fauxScrollAmt = 1;
    console.log(document.getElementById("lastProj").getBoundingClientRect().bottom - window.innerHeight + 40);
}

/******************************************************************************/
/*************************** RESIZING *****************************************/
/******************************************************************************/

var resizeTimeout;

function resize() {
    fixSectionHeights();
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
        initFocusPoint();
        initCanv();
        setTimeout(function () {
            initContent();
            genPartsAsync(function () {
                mouseMoved = true;
                updateMinDist();
            });
        }, 10);
    }, 200);
}

window.onresize = resize;

/******************************************************************************/
/*************************** INITIALIZATION ***********************************/
/******************************************************************************/

function initContent() {
    ctx.clearRect(0,0,canv.width,canv.height);
    ctx.fillStyle = "black";
    ctx.font = "bolder " + (Math.pow(canv.width,0.6)*RATIO_MULT) + "px Inter UI, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Samuel Kilgus",canv.width/2, (canv.height/2)+(0  * (Math.pow(canv.width,0.6)*RATIO_MULT)));
}

function initCanv() {
    canv = document.getElementById("canvas");
    ctx  = canv.getContext("2d");
    canv.style.width  = window.innerWidth  + "px";
    canv.style.height = window.innerHeight + "px";
    canv.width  = window.innerWidth  * RATIO_MULT;
    canv.height = window.innerHeight * RATIO_MULT;
}

function initParts() {
    genPartsWorker = new Worker('genPartsWorker.js');

    genPartsWorker.addEventListener('message', function(e) {
        var data = e.data;
        animCenter = data.animCenter;
        allParts = data.allParts;
        usedColors = data.usedColors;
        for (var i = 0; i < usedColors.length; i++) {
            usedColors[i] = usedColors[i].split(',').map(function(item) {
                return parseInt(item, 10);
            });
        }
        if (genPartsWorkerCallback) genPartsWorkerCallback();
    }, false);

    genPartsAsync(function () {
        document.body.classList.remove("loading");
        document.body.addEventListener("mousemove",updateMousePos);
        initFocusPoint();
        setInterval(updateParts, 10);
    });
}

function fixSectionHeights() {
    var menuCont = document.getElementById("menuCont");

    menuCont.style.height = (window.innerHeight - 120) + "px";
    if (isMobile) {
        document.getElementById("main").style.paddingTop = 40 + "px";
    }
    else {
        document.getElementById("main").style.paddingTop = (window.innerHeight - 40) + "px";
    }
}

function init() {
    isMobile = checkMobile();
    if (!isMobile) {
        updateMinDist();
        initCanv();
        initContent();
        initParts();
        document.getElementById("mobileText").style.display = "none";
    }
    else {
        setTimeout(() => {
            document.body.classList.remove("loading");
        }, 500);
        initFocusPoint();
    }
    fixSectionHeights();
    document.getElementById("menuCont").addEventListener("mouseenter",function () {
        canvasInteraction = false;
    })
    document.getElementById("menuCont").addEventListener("mouseleave",function () {
        canvasInteraction = true;
    })
    // document.body.addEventListener("wheel",handleMainScroll);
}

window.onload = init;
window.onresize = fixSectionHeights;
