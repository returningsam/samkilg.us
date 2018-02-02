const NUM_ITEMS = 7;
const UPDATE_MARGIN = 200;

const MIN_ROTATE = 0;
const MAX_ROTATE = 60;

const MIN_SIDE_WIDTH = 40; // %
const MAX_SIDE_WIDTH = 60; // %

var curPerc = 20;

var leftSideEl;
var rightSideEl;

var percBetween = (p,a,b) => {return a + ((b-a)*(p/100))};

function updateSideWidths() {
    leftSideEl.style.width = percBetween(100 - curPerc,MIN_SIDE_WIDTH,MAX_SIDE_WIDTH) + "%";
    rightSideEl.style.width = percBetween(curPerc,MIN_SIDE_WIDTH,MAX_SIDE_WIDTH) + "%";
}

function updateSideTransforms() {
    leftSideEl.style.transform  = "rotateY(" + percBetween(curPerc,MIN_ROTATE,MAX_ROTATE) + "deg)";
    rightSideEl.style.transform = "rotateY(-" + percBetween(100 - curPerc,MIN_ROTATE,MAX_ROTATE) + "deg)";
}

function frame() {
    updateSideWidths();
    updateSideTransforms();
}

function initItems() {
    for (var i = 0; i < (NUM_ITEMS * NUM_ITEMS); i++) {
        var item1 = document.createElement("div");
        item1.id = "left_" + i;
        item1.classList.add("item");
        item1.classList.add("circle");
        item1.addEventListener("click",handleItemClick);
        leftSideEl.appendChild(item1);

        var item2 = document.createElement("div");
        item2.id = "right_" + i;
        item2.classList.add("item");
        item2.classList.add("circle");
        item2.addEventListener("click",handleItemClick);
        rightSideEl.appendChild(item2);
    }
}

function handleItemClick(ev) {
    var i = parseInt(ev.target.id.split("_")[1]);
    if (i == curActive) iterGame();
}

function initSides() {
    leftSideEl = document.getElementById("left");
    rightSideEl = document.getElementById("right");
}

function handleMouseMove(ev) {
    var mouseX = ev.clientX;
    curPerc = Math.max(0,Math.min(100,((mouseX-UPDATE_MARGIN) / (window.innerWidth-(UPDATE_MARGIN*2))) * 100));
    frame();
}

var curActive;
var curSide = false; // false is left

function iterGame() {
    curSide = !curSide;
    curActive = chance.integer({min: 0,max: (NUM_ITEMS*NUM_ITEMS)-1});
    var items = document.getElementsByClassName("item");
    for (var i = 0; i < NUM_ITEMS*NUM_ITEMS; i++) {
        document.getElementById("left_" + i).classList.remove("active");
        document.getElementById("right_" + i).classList.remove("active");
        if (i == curActive) {
            if (curSide) document.getElementById("right_" + i).classList.add("active");
            else document.getElementById("left_" + i).classList.add("active");
        }
    }
}

function initGrain(id) {
    var gCanv = document.getElementById(id);
    var gCtx = gCanv.getContext("2d");
    gCanv.width  = gCanv.clientWidth  * 2;
    gCanv.height = gCanv.clientHeight * 2;
    gCtx.clearRect(0,0,gCanv.width,gCanv.width);
    var imgData = gCtx.createImageData(gCanv.width,gCanv.height);
    for (var i = 0; i < imgData.data.length; i+=4) {
        imgData.data[i]   = chance.integer({min: 0, max: 200});
        imgData.data[i+1] = chance.integer({min: 0, max: 200});
        imgData.data[i+2] = chance.integer({min: 0, max: 200});
        imgData.data[i+3] = chance.integer({min: 0, max: 70});
    }
    gCtx.putImageData(imgData, 0, 0);
    // console.log("grain done");
}

function init() {
    initSides();
    initItems();
    frame();
    iterGame();
    initGrain("canvas_left");
    initGrain("canvas_right");
    document.body.addEventListener("mousemove",handleMouseMove);
}

window.onload = init;
