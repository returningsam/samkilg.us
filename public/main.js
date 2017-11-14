const CANV_RATIO_MULT   = 2;
const TILE_SIZE         = 100 * CANV_RATIO_MULT;
const TILE_BORDER_WIDTH = 4   * CANV_RATIO_MULT;

var screenWidth;
var screenHeight;

/******************************************************************************/
/************************* DRAW CANVAS ****************************************/
/******************************************************************************/

const DRAW_LINE_WIDTH = 2;

var drawCanv;
var drawCtx;

var lastMouseX;
var lastMouseY;
var curMouseX;
var curMouseY;

var drawInterval;

function updateMousePos(ev) {
    curMouseX = (ev.clientX - ev.target.offsetLeft) * CANV_RATIO_MULT;
    curMouseY = (ev.clientY - ev.target.offsetTop) * CANV_RATIO_MULT;
    if (!lastMouseX) lastMouseX = curMouseX;
    if (!lastMouseY) lastMouseY = curMouseY;
}

function connectDraw() {
    if (curMouseX  && curMouseX  && lastMouseX && lastMouseX) {
        drawCtx.beginPath();
        drawCtx.moveTo(lastMouseX,lastMouseY);
        drawCtx.lineTo(curMouseX ,curMouseY);
        drawCtx.stroke();
        drawCtx.closePath();
        lastMouseX = curMouseX;
        lastMouseY = curMouseY;
    }
}

function startDraw(ev) {
    updateMousePos(ev);
    drawInterval = setInterval(connectDraw, 50);
    drawCanv.addEventListener('mousemove',updateMousePos);
}

function endDraw(ev) {
    if (drawInterval) clearInterval(drawInterval);
    drawCanv.removeEventListener('mousemove',updateMousePos);
    lastMouseX = lastMouseY = curMouseX = curMouseY = null;
}

function initDrawCanv() {
    drawCanv = document.getElementById('draw-canvas');
    drawCtx  = drawCanv.getContext('2d');
    drawCtx.lineWidth = DRAW_LINE_WIDTH

    drawCanv.width  = (2 * TILE_SIZE) - TILE_BORDER_WIDTH;
    drawCanv.height = (2 * TILE_SIZE) - TILE_BORDER_WIDTH;
    drawCanv.addEventListener('mousedown',startDraw);

    drawCanv.addEventListener('mouseup'  ,endDraw);
    drawCanv.addEventListener('mouseout' ,endDraw);
}

/******************************************************************************/
/************************* BACKGROUND CANVAS **********************************/
/******************************************************************************/

var bgCanv;
var bgCtx;

function drawGrid() {
    bgCtx.clearRect(0,0,bgCanv.width,bgCanv.height);
    bgCtx.lineWidth = TILE_BORDER_WIDTH;
    // bgCtx.strokeStyle = "green";
    for (var i = TILE_SIZE; i < bgCanv.width; i += TILE_SIZE) {
        bgCtx.beginPath();
        bgCtx.moveTo(i, 0);
        bgCtx.lineTo(i, bgCanv.height);
        bgCtx.stroke();
        bgCtx.closePath();
    }

    for (var i = bgCanv.height - TILE_SIZE; i > 0; i -= TILE_SIZE) {
        bgCtx.beginPath();
        bgCtx.moveTo(0,            i);
        bgCtx.lineTo(bgCanv.width, i);
        bgCtx.stroke();
        bgCtx.closePath();
    }
}

function initBGCanv() {
    bgCanv = document.getElementById('background-canvas');
    bgCtx  = bgCanv.getContext('2d');

    bgCanv.width  = screenWidth  * CANV_RATIO_MULT;
    bgCanv.height = screenHeight * CANV_RATIO_MULT;
}

/******************************************************************************/
/************************* RESIZING *******************************************/
/******************************************************************************/

var resizeTimeout;

function resize() {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
        console.log("Resizing...");
        init();
    }, 500);
}

/******************************************************************************/
/************************* INITIALIZATION *************************************/
/******************************************************************************/

function initVars() {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
}

function init() {
    initVars();
    initBGCanv();
    initDrawCanv();
    drawGrid();
}

window.onload   = init;
window.onresize = resize;
