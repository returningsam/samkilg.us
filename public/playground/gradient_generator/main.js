const RATIO_MULT     = 1;
const DEF_DRAW_COLOR = "0,0,0";
const DEF_DRAW_RAD   = 1;

var drawingMode;

var canv;
var ctx;

var canvWidth;
var canvHeight;

var curDrawRadius;
var curDrawColor;

var pixelData;
var nextPixels;

function r_in_r(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
}

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    let ingsam = (result ? ("" +
        parseInt(result[1], 16) + "," +
        parseInt(result[2], 16) + "," +
        parseInt(result[3], 16) + "") : null);

    return ingsam;
}

function eventFire(el, etype){
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}

/******************************************************************************/
/*************************** Pixel Matrix Helpers *****************************/
/******************************************************************************/

function indtoCoord(ind) {
    ind = ind / 4;
    var y = Math.floor(ind / canvWidth);
    var x = ind % canvWidth;
    return [x,y];
}

function coordToInd(x,y) {
    return (x + (y * canvWidth)) * 4;
}

function updateCanvas() {
    ctx.clearRect(0,0,canvWidth,canvHeight);
    ctx.putImageData(pixelData,0,0);
}

/******************************************************************************/
/*************************** Blur to Gradient *********************************/
/******************************************************************************/

function doBlur(radius) {
    pixelData = StackBlur.imageDataRGBA(pixelData, 0, 0, canvWidth, canvHeight, radius);
    updateCanvas();
}

/******************************************************************************/
/*************************** Build Gradient ***********************************/
/******************************************************************************/

var fillInterval;
var canvUpdateInterval;

var step = 0;

function inBounds(x,y) {
    var top    = (y < canvHeight);
    var bottom = (y > -1);
    var right  = (x > -1);
    var left   = (x < canvWidth);
    return top && bottom && left && right;
}

function hasNeighbors(ind) {
    let coord = indtoCoord(ind);
    let x = coord[0];
    let y = coord[1];

    let maxDif = 1;
    for (var i = -maxDif; i <= maxDif; i++) {
        for (var j = -maxDif; j <= maxDif; j++) {
            let nX  = x + i;
            let nY  = y + j;
            let nInd = coordToInd(nX,nY);
            if (inBounds(nX,nY) && pixelData.data[nInd + 3] != 255) {
                return true;
            }
        }
    }
    return false;
}

function getNeighbors(ind) {
    let coord = indtoCoord(ind);
    let x = coord[0];
    let y = coord[1];

    var neighbors = [];
    let maxDif = 1;
    for (var i = -maxDif; i <= maxDif; i++) {
        for (var j = -maxDif; j <= maxDif; j++) {
            let nX  = x + i;
            let nY  = y + j;
            let nInd = coordToInd(nX,nY);
            if (inBounds(nX,nY) && pixelData.data[nInd + 3] != 255) {
                neighbors.push(nInd)
            }
        }
    }
    return neighbors;
}

var DIF_X = 1;
var DIF_Y = 1;

function updateDiffs() {
    if (DIF_X == 1) {
        if (DIF_Y == 1) {
            DIF_Y = -1;
        }
        else {
            DIF_X = -1
        }
    }
    else {
        if (DIF_Y == 1) {
            DIF_X = 1
        }
        else {
            DIF_Y = 1;
        }
    }
}

function getNeighbor(ind) {
    let coord = indtoCoord(ind);
    let x = coord[0];
    let y = coord[1];

    let nX  = x + DIF_X;
    let nY  = y + DIF_Y;

    updateDiffs();

    let nInd = coordToInd(nX,nY);
    if (inBounds(nX,nY) && pixelData.data[nInd + 3] != 255) {
        return nInd;
    }
    return false;
}

var MPPF = 500;

function getRandomSubarray(arr,size) {
    var shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
}

function getRandomValue(arr) {
    return arr.splice(r_in_r(0,arr.length-1),1)[0];
}

var nextPixelsDFS = [];
var max_dfs_strings = 1000;

var nextPixelsStack = [];

function fillSpaceDFSStack() {

    // console.log(nextPixels.length);

    if (nextPixels.length == 0) {
        clearInterval(fillInterval);
        clearInterval(canvUpdateInterval);
        return;
    }

    if (nextPixelsStack.length == 0) {
        console.log("Iteration finished...");
        updateCanvas();
        buildPixelData();
        // max_dfs_strings = Math.min(nextPixels.length,max_dfs_strings);
        var nextStackRoot = [];
        for (var i = 0; i < Math.min(nextPixels.length-1,max_dfs_strings); i++) {
            nextStackRoot.push(getRandomValue(nextPixels));
        }
        nextPixelsStack.push(nextStackRoot);
    }

    var tempPixelData = ctx.createImageData(canvWidth,canvHeight);
    tempPixelData.data.set(pixelData.data);

    var curStackSection = nextPixelsStack[nextPixelsStack.length-1];
    var tempStackSection = [];

    for (var i = curStackSection.length-1; i >= 0; i--) {
        var curPixel = curStackSection[i];
        // console.log(curPixel);

        var nextPixel = getRandomValue(getNeighbors(curPixel));
        // console.log(nextPixel);

        tempPixelData.data[nextPixel]   = pixelData.data[curPixel];
        tempPixelData.data[nextPixel+1] = pixelData.data[curPixel+1];
        tempPixelData.data[nextPixel+2] = pixelData.data[curPixel+2];
        tempPixelData.data[nextPixel+3] = 255;

        pixelData = tempPixelData;

        if (!hasNeighbors(curPixel)) {
            curStackSection.pop();
        }

        if (hasNeighbors(nextPixel)) {
            tempStackSection.push(nextPixel);
        }
    }

    if (curStackSection.length < 1) {
        nextPixelsStack.pop();
    }

    if (tempStackSection.length > 0) {
        nextPixelsStack.push(tempStackSection);
    }

    // if (nextPixelsStack[nextPixelsStack.length-1].length < Math.min(nextPixels.length,max_dfs_strings)) {
    //     updateCanvas();
    //     buildPixelData();
    // }

    var overflow = 0;

    while (overflow < 10000 && nextPixelsStack.length > 0 && nextPixelsStack[nextPixelsStack.length-1].length < Math.min(nextPixels.length,max_dfs_strings)) {
        // console.log("refill");
        var temp1 = nextPixelsStack.pop();
        while (temp1.length < 1) {
            if (nextPixelsStack.length < 1) {
                return;
            }
            else {
                temp1 = nextPixelsStack.pop();
            }
        }
        var temp2 = [];
        if (nextPixelsStack.length > 0) temp2 = nextPixelsStack.pop();

        var newStep = temp1.concat(temp2);
        if (newStep.length > 0) {
            nextPixelsStack.push(newStep);
        }
        overflow++;
    }
}

function fillSpaceDFSRandom() {

    while (nextPixelsDFS.length < Math.min(nextPixels.length,max_dfs_strings)) {
        max_dfs_strings *= 1.1;
        nextPixelsDFS.push(getRandomValue(nextPixels));
    }

    if (nextPixels.length == 0) {
        console.log("Space filled...");
        clearInterval(fillInterval);
        clearInterval(canvUpdateInterval);
        return;
    }

    var tempPixelData = ctx.createImageData(canvWidth,canvHeight);
    tempPixelData.data.set(pixelData.data);

    var tempNextPixelsDFS = [];

    var changesMade = false;

    while (nextPixelsDFS.length > 0) {
        // console.log(nextPixelsDFS.length);
        var curPixel = nextPixelsDFS.splice(r_in_r(0,nextPixelsDFS.length-1),1)[0];
        // var nbrs = getNeighborsMod(curPixel);
        var nextPixel = getRandomValue(getNeighbors(curPixel));
        if (nextPixel) {
            // var nextPixel = getRandomValue(nbrs);
            tempNextPixelsDFS.push(nextPixel);

            tempPixelData.data[nextPixel]   = pixelData.data[curPixel];
            tempPixelData.data[nextPixel+1] = pixelData.data[curPixel+1];
            tempPixelData.data[nextPixel+2] = pixelData.data[curPixel+2];
            tempPixelData.data[nextPixel+3] = 255;
            changesMade = true;
        }
    }

    pixelData = tempPixelData;
    nextPixelsDFS = tempNextPixelsDFS;

    if (!changesMade) {
        console.log("Iteration finished...");
        clearInterval(fillInterval);
        clearInterval(canvUpdateInterval);

        updateCanvas();
        buildPixelData();
        setTimeout(fillSpace, 1);
    }
}

function fillSpaceBFS() {
    step++;
    // console.log(step);

    var changesMade = false;

    var numEmpty = 0;
    var numFull  = 0;

    var tempPixelData = ctx.createImageData(canvWidth,canvHeight);
    tempPixelData.data.set(pixelData.data);


    var tempNextPixels = [];


    if (nextPixels.length >= MPPF){
        nextPixels = getRandomSubarray(nextPixels,  MPPF);
    }

    for (var k = 0; k < nextPixels.length; k++) {
        var i = nextPixels[k];

        var neighbors = getNeighbors(i);
        // neighbors = getRandomSubarray(neighbors,r_in_r(neighbors.length/2,neighbors.length));

        for (var j = 0; j < neighbors.length; j++) {
            let nbrInd = neighbors[j];
            tempPixelData.data[nbrInd]   = pixelData.data[i];
            tempPixelData.data[nbrInd+1] = pixelData.data[i+1];
            tempPixelData.data[nbrInd+2] = pixelData.data[i+2];
            tempPixelData.data[nbrInd+3] = 255;

            tempNextPixels.push(nbrInd);
            changesMade = true;
        }
    }

    pixelData = tempPixelData;
    nextPixels = tempNextPixels;

    // console.log(numEmpty);
    // console.log(numFull);

    if (!changesMade) {
        clearInterval(fillInterval);
        clearInterval(canvUpdateInterval);

        console.log("done");
        if (step > 1) {
            updateCanvas();
            buildPixelData();
            setTimeout(fillSpace, 1);
        }
        step = 0;
    }
}

function fillSpace() {
    fillInterval = setInterval(fillSpaceDFSStack, 1);
    canvUpdateInterval = setInterval(updateCanvas, 100);
    // setInterval(function () {
    //     console.log(nextPixelsStack.length);
    // }, 500);
}

function startFill() {
    buildPixelData();
    fillSpace();
}

/******************************************************************************/
/*************************** Transition ***************************************/
/******************************************************************************/

function buildPixelData() {
    nextPixels = [];
    pixelData = ctx.getImageData(0,0,canvWidth,canvHeight);
    for (var i = 0; i < pixelData.data.length; i+=4) {
        if (pixelData.data[i+3] != 0) {
            if (hasNeighbors(i)) {
                pixelData.data[i+3] = 255;
                nextPixels.push(i);
            }
        }
        else {
            pixelData.data[i]   = 0;
            pixelData.data[i+1] = 0;
            pixelData.data[i+2] = 0;
            pixelData.data[i+3] = 0;
        }
    }
    updateCanvas();
}

/******************************************************************************/
/*************************** Drawing ******************************************/
/******************************************************************************/

//////////////////////////// Event Handlers ////////////////////////////////////

function drawHandler(ev) {
    var xCoord = ev.clientX * RATIO_MULT;
    var yCoord = ev.clientY * RATIO_MULT;
    registerCirc(xCoord,yCoord);
}

function endDrawHandler(ev) {
    canv.removeEventListener('mousemove', drawHandler);
}

function startDrawHandler(ev) {
    canv.addEventListener('mousemove', drawHandler);
}

////////////////////////////////////////////////////////////////////////////////

function setDrawRadius(r) {curDrawRadius = r;}

function randDrawColor() {
    var color = Math.floor(Math.random()*16777215).toString(16);
    console.log(color);
    setDrawColor(color);
}

function setDrawColor(c) {
    ctx.fillStyle = "rgb(" + hexToRgb(c) + ")";
    curDrawColor = c;
}

function flattenColor(c) {
    return c.join(",");
}

function inflateColor(c) {
    var nC = c.split(",");
    for (var i = 0; i < nC.length; i++) {
        nC[i] = parseInt(nC[i]);
    }
    return nC;
}

var drawTimeout;
var circsToDraw;


function registerCirc(x,y) {
    if (!circsToDraw) circsToDraw = [];
    circsToDraw.push([x,y]);

    if (drawTimeout) clearTimeout(drawTimeout);
    drawTimeout = setTimeout(drawCircs,10);
}

function drawCircs() {
    let rad = curDrawRadius;
    while (circsToDraw.length > 0) {
        let coord = circsToDraw.shift()
        let x = coord[0];
        let y = coord[1];
        ctx.beginPath();
        ctx.arc(x,y,curDrawRadius,0,2*Math.PI,false);
        ctx.fill();
        ctx.closePath();
    }
}

function stopDrawing() {
    drawingMode = false;
    canv.removeEventListener('mousedown',startDrawHandler);
    canv.removeEventListener('mouseup',endDrawHandler);
}

function startDrawing() {

    //////////////////////////

    setDrawColor(DEF_DRAW_COLOR);
    setDrawRadius(DEF_DRAW_RAD);

    //////////////////////////

    drawingMode = true;
    canv.addEventListener('mousedown',startDrawHandler);
    canv.addEventListener('mouseup',endDrawHandler);

    buildPixelData();
}

/******************************************************************************/
/*************************** Initialization ***********************************/
/******************************************************************************/

function intVars() {
    canvWidth = window.innerWidth * RATIO_MULT;
    canvHeight = window.innerHeight * RATIO_MULT;
}

function initCanv() {
    canv = document.getElementById('canvas');
    ctx = canv.getContext('2d');
    ctx.lineWidth = 1 * RATIO_MULT;
    canv.width = canvWidth;
    canv.height = canvHeight;
    randDrawColor();
}

function newGradient() {
    intVars();
    initCanv();
    startDrawing();
}

function downloadCanvas() {
    var dataURL = canvas.toDataURL();
    window.open(dataURL,"_blank");
}

function init() {
    newGradient();
}

window.onload = init;
