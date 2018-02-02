const CANV_RATIO_MULT = 2;

var mouseX;
var mouseY;
var mouseCh = false;

var canv;
var ctx;

function updateMousePos(ev) {
    if (ev.clientX != mouseX || ev.clientY != mouseY) {
        mouseX = ev.clientX;
        mouseY = ev.clientY;
        mouseCh = true;
    }
}

function checkMousePos() {
    if (mouseCh) {
        mouseCh = false;
        var cursorImg = new Image();
        cursorImg.src = "pointer.png";
        ctx.drawImage(cursorImg, mouseX * CANV_RATIO_MULT, mouseY * CANV_RATIO_MULT, 21 * CANV_RATIO_MULT, 32 * CANV_RATIO_MULT);
        console.log(ctx.getImageData(0,0,canv.width,canv.height));
    }
}

function initCanv() {
    canv = document.getElementById("bgCanv");
    canv.width = window.innerWidth * CANV_RATIO_MULT;
    canv.height = window.innerHeight * CANV_RATIO_MULT;

    ctx = canv.getContext("2d");
}

function init() {
    document.body.addEventListener("mousemove",updateMousePos);
    initCanv();
    setInterval(checkMousePos, 5);
}

window.onload = init;
