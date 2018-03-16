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

/******************************************************************************/
/*************************** CANVAS ANIMATION *********************************/
/******************************************************************************/

const RATIO_MULT = 1.5;
const MAX_DIFF = 5000;

var canv;
var ctx;

var mouseX;
var mouseY;
var mouseMoved = false;
var curDist;

var canvUpdateInterval;

var allParts;

var usedColors;

var animCenter;

var genPartsWorker;

function getColorID(color) {
    if (usedColors.indexOf(color) < 0) usedColors.push(color);
    return usedColors.indexOf(color);
}

function newPart(points) {
    var cx = 0;
    var cy = 0;
    for (var i = 0; i < points.length; i++) {
        cx += points[i][0][0];
        cy += points[i][0][1];
    }
    cx = cx / points.length;
    cy = cy / points.length;
    var cDist = getDist(cx,cy,animCenter[0][0],animCenter[0][1]);

    return {
        points: points,
        cDist: cDist,
        dx: chance.integer({min: -window.innerWidth/1.5, max: window.innerWidth/1.5}),
        dy: chance.integer({min: -window.innerHeight/1.5, max: window.innerHeight/1.5}),
    };
}

var genPartsWorkerCallback;

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

function drawParts(dist) {
    var noise = 1;
    var imgData = ctx.createImageData(canv.width,canv.height);
    for (var i = 0; i < allParts.length; i++) {
        var curPart = allParts[i];
        var distMult = Math.pow(1.001,Math.max(-1*((curPart.cDist/2) - dist),1))-1.001;
        for (var j = 0; j < curPart.points.length; j++) {
            var curPoint = curPart.points[j];
            var ind = coordToInd(
                curPoint[0][0] + Math.floor(curPart.dx*distMult),
                curPoint[0][1] + Math.floor(curPart.dy*distMult)
            );
            var c = usedColors[curPoint[1]].split(",")
            imgData.data[ind]   = parseInt(c[0]);
            imgData.data[ind+1] = parseInt(c[1]);
            imgData.data[ind+2] = parseInt(c[2]);
            imgData.data[ind+3] = parseInt(c[3]);
        }
    }
    ctx.clearRect(0,0,canv.width,canv.height);
    ctx.putImageData(imgData,0,0);
}

function frame() {
    if (mouseMoved) {
        if (loadTimeout) clearTimeout(loadTimeout);
        if (loadInterval) clearInterval(loadInterval);
        var newDist = getDist(focusPoint.x,focusPoint.y,mouseX,mouseY);
        if (newDist <= focusPoint.r/2) newDist = 0;
        else newDist = Math.abs(newDist - (focusPoint.r/2));

        var distCh = Math.abs(newDist-curDist);
        var distChDir = (newDist-curDist)/Math.abs(newDist-curDist);
        if (distCh > 1)
            distCh = parseFloat((Math.pow(Math.abs(newDist-curDist),0.7) * distChDir).toFixed(1));
        else mouseMoved = false;

        curDist += distCh;

        drawParts(curDist);
    }
}

/******************************************************************************/
/*************************** CANVAS LOAD ANIMATION ****************************/
/******************************************************************************/

const MAX_LOAD_DIST = 500;

var loadTimeout;
var loadInterval;
var loadDist = 2;

function loadAnimation() {
    loadDist += Math.min(Math.max(1,(MAX_LOAD_DIST - loadDist)/2),loadDist*2);
    drawParts(loadDist);
    if (loadDist >= MAX_LOAD_DIST && loadInterval) {
        clearInterval(loadInterval);
        loadInterval = null;
        curDist = loadDist;
        loadDist = 2;
        if (!isMobile) document.body.addEventListener("mousemove",updateMousePos);
    }
}

function startLoadAnimation() {
    loadTimeout = setTimeout(function () {
        loadInterval = setInterval(loadAnimation, 50);
    }, 500);
    canvUpdateInterval = setInterval(frame, 10);
}

/******************************************************************************/
/*************************** FOCUS POINT **************************************/
/******************************************************************************/

var focusPoint;
var focusPointEl;

var hintMessages = ["hey", "yo", "click", "psst", "boo", "ahem"];
var curHintMessage = 0;
var hintTextInterval;

function expandFocusPoint() {
    focusPointEl.removeEventListener("click",openMenu);
    setTimeout(function () {
        focusPointEl.addEventListener("click",stageCloseMenu);
    }, 10);
    var newDim = Math.max(window.innerWidth,window.innerHeight);
    focusPointEl.style.width  = (newDim*2) + "px";
    focusPointEl.style.height = (newDim*2) + "px";
    focusPointEl.style.left = (-newDim/2) + "px";
    focusPointEl.style.top  = (-newDim/2) + "px";
    // focusPointEl.style.borderRadius = 0;
    focusPointEl.style.backgroundColor = "black";
    focusPointEl.className = focusPointEl.className + " closeMenu";
}

function collapseFocusPoint() {
    focusPointEl.className = focusPointEl.className.replace(" closeMenu", "");
    focusPointEl.removeEventListener("click",closeMenu);
    focusPointEl.addEventListener("click",openMenu);
    focusPointEl.removeAttribute("style");
}

function drawFocusPoint() {
    focusPointEl = document.getElementById("focusPoint");
    focusPointEl.style.left = (focusPoint.x - (focusPoint.r/2)) + "px";
    focusPointEl.style.top  = (focusPoint.y - (focusPoint.r/2)) + "px";
    focusPointEl.addEventListener("click",openMenu);
}

function genFocusPoint() {
    var padding = Math.min(window.innerWidth,window.innerHeight)/10;
    focusPoint = {
        x: chance.integer({min: padding, max: window.innerWidth  - padding}),
        y: chance.integer({min: padding, max: window.innerHeight - padding}),
        r: 100
    }
}

/******************************************************************************/
/*************************** MENU STUFF ***************************************/
/******************************************************************************/

var menuOpen = false;
var redrawTimeout;
var closeMenuStaged = false;

function stageCloseMenu() {
    closeMenuStaged = true;
}

function openMenu() {
    menuOpen = true;
    clearInterval(canvUpdateInterval);
    clearInterval(hintTextInterval);
    document.getElementById("canvas").style.opacity = 0;
    expandFocusPoint();
    var hintText = document.getElementById("focusPoint").getElementsByTagName("p")[0];
    hintText.style.display = "none";
    document.getElementById("menuCont").style.display = "flex";
    if (isMobile) document.getElementById("mobileMenuClose").style.display = "flex";

    redrawTimeout = setTimeout(function () {
        document.getElementById("menuCont").style.opacity = "1";
        if (isMobile) document.getElementById("mobileMenuClose").style.opacity = "1";
        setTimeout(function () {
            document.body.removeEventListener("mousemove",updateMousePos);
            mouseMoved = false;
            initContent();
            genPartsAsync(function () {
                if (closeMenuStaged) closeMenu();
                focusPointEl.removeEventListener("click",stageCloseMenu);
                focusPointEl.addEventListener("click",closeMenu);
                closeMenuStaged = false;
            });
        }, 500);
    }, 250);
}

function closeMenu() {
    clearTimeout(redrawTimeout);
    menuOpen = false;
    document.getElementById("menuCont").style.opacity = null;
    if (isMobile) document.getElementById("mobileMenuClose").style.opacity = null;
    setTimeout(function () {
        if (isMobile) document.getElementById("mobileMenuClose").style.display = null;
        document.getElementById("menuCont").style.display = null;
        document.getElementById("canvas").style.opacity = 1;
        collapseFocusPoint();
        genFocusPoint();
        if (isMobile) {
            lastBeta = null;
            lastGamma = null;
            mouseX = focusPoint.x;
            mouseY = focusPoint.y;
            moveMobileFocusPoint();
        }
        drawFocusPoint();
        setTimeout(function () {
            startLoadAnimation();
        }, 200);
    }, 100);
}

/******************************************************************************/
/*************************** EVENT HANDLERS ***********************************/
/******************************************************************************/

var lastBeta;
var lastGamma;

function updateMousePos(ev) {
    if (mouseX != ev.clientX || mouseY != ev.clientY) {
        mouseX = ev.clientX;
        mouseY = ev.clientY;
        mouseMoved = true;
    }
}

function moveMobileFocusPoint() {
    var mobilePoint = document.getElementById("mobilePoint");
    mobilePoint.style.left = (mouseX-50) + "px";
    mobilePoint.style.top  = (mouseY-50) + "px";
}

function updateOrientation(ev) {
    var curBeta = (-5 * ev.beta);
    var curGamma = (-5 * ev.gamma);
    if (!lastBeta || !lastGamma) {
        mouseX = focusPoint.x;
        mouseY = focusPoint.y;
        lastBeta  = curBeta;
        lastGamma = curGamma;
        mouseMoved = true;
        var mobilePoint = document.getElementById("mobilePoint");
        if (!mobilePoint) {
            mobilePoint = document.createElement("div");
        }
        mobilePoint.className  = "mobilePoint";
        mobilePoint.id         = "mobilePoint";
        if (!document.getElementById("mobilePoint")) {
            document.body.appendChild(mobilePoint);
        }
        moveMobileFocusPoint();
    }
    else if (lastBeta != curBeta || lastGamma != curGamma) {
        var dx = lastGamma - curGamma;
        var dy = lastBeta - curBeta;
        lastBeta  = curBeta;
        lastGamma = curGamma;
        mouseMoved = true;
        mouseX = Math.max(0,Math.min(window.innerWidth,mouseX + dx));
        mouseY = Math.max(0,Math.min(window.innerHeight,mouseY + dy));
        moveMobileFocusPoint();
    }
}

/******************************************************************************/
/*************************** FRIENDS ******************************************/
/******************************************************************************/

const FRIENDS = ["https://dasha.design","http://cole.works","https://izzyb.net/","http://lukaschulz.com/","http://calebpayne.xyz/","http://www.tatenewfield.com/"];

function handleFriendClick(ev) {
    var fLink = FRIENDS[chance.integer({min:0,max:FRIENDS.length-1})];
    this.href = fLink;
}

/******************************************************************************/
/*************************** RESIZING *****************************************/
/******************************************************************************/

function initGrain() {
    var gCanv = document.getElementById("grainCanv");
    var gCtx = gCanv.getContext("2d");
    gCanv.width  = window.innerWidth  * 2;
    gCanv.height = window.innerHeight * 2;
    gCtx.clearRect(0,0,gCanv.width,gCanv.width);
    var imgData = gCtx.createImageData(gCanv.width,gCanv.height);
    for (var i = 0; i < imgData.data.length; i+=4) {
        imgData.data[i]   = chance.integer({min: 0, max: 200});
        imgData.data[i+1] = chance.integer({min: 0, max: 200});
        imgData.data[i+2] = chance.integer({min: 0, max: 200});
        imgData.data[i+3] = chance.integer({min: 0, max: 25});
    }
    gCtx.putImageData(imgData, 0, 0);
    console.log("grain done");
}

/******************************************************************************/
/*************************** RESIZING *****************************************/
/******************************************************************************/

var resizeTimeout;

function resize() {
    if (menuOpen) {
        var focusPointEl = document.getElementById("focusPoint");
        focusPointEl.style.width  = window.innerWidth*2 + "px";
        focusPointEl.style.height = window.innerHeight*2 + "px";
        focusPointEl.style.top    = (-window.innerHeight/2) + "px";
        focusPointEl.style.left   = (-window.innerWidth/2) + "px";
    }
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
        initGrain();
        canv.width  = window.innerWidth  * RATIO_MULT;
        canv.height = window.innerHeight * RATIO_MULT;
        ctx.clearRect(0,0,canv.width,canv.height);
        if (!menuOpen) {
            genFocusPoint();
            drawFocusPoint();
        }
        initContent();
        genPartsAsync(function () {
            mouseMoved = true;
            frame();
        });
    }, 100);
}

window.onresize = resize;

/******************************************************************************/
/*************************** INITIALIZATION ***********************************/
/******************************************************************************/

function initContent() {
    ctx.clearRect(0,0,canv.width,canv.height);
    ctx.fillStyle = "black";
    ctx.font = "bolder " + (10*RATIO_MULT) + "vmin Inter UI, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Samuel Kilgus",canv.width/2, canv.height/2);
}

function initCanv() {
    canv = document.getElementById("canvas");
    ctx  = canv.getContext("2d");
    canv.width  = window.innerWidth  * RATIO_MULT;
    canv.height = window.innerHeight * RATIO_MULT;
}

function init() {
    isMobile = checkMobile();
    initGrain();
    initCanv();
    genFocusPoint();
    drawFocusPoint();
    initContent();
    document.getElementById("friendButton").addEventListener("click",handleFriendClick);

    genPartsWorker = new Worker('genPartsWorker.js');

    genPartsWorker.addEventListener('message', function(e) {
        var data = e.data;
        animCenter = data.animCenter;
        allParts = data.allParts;
        usedColors = data.usedColors;
        frame();
        if (genPartsWorkerCallback) genPartsWorkerCallback();
    }, false);

    genPartsAsync(function () {
        startLoadAnimation();

        if (isMobile) {
            window.addEventListener("deviceorientation", updateOrientation, true);
            var hintText = document.getElementById("focusPoint").getElementsByTagName("p")[0];
            setTimeout(function () {
                hintText.style = null;
                hintTextInterval = setInterval(function () {
                    curHintMessage++;
                    if (curHintMessage >= hintMessages.length) curHintMessage = 0;
                    document.getElementById("focusPoint").getElementsByTagName("p")[0].innerHTML = hintMessages[curHintMessage];
                }, 4000);
            }, 10000);
        }
    });
}

window.onload = init;
