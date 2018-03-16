/******************************************************************************/
/*************************** LOADING ANIMATION ********************************/
/******************************************************************************/

const TITLE_TEXT_BASE_ID = "titleText";

var maxWidth;
var maxHeight;

var stillLoading = true;

var initialPositions = {
    0: "lt",
    1: "rt",
    2: "lb",
    3: "rb"
};

var curPositions = {
    0: "lt",
    1: "rt",
    2: "lb",
    3: "rb"
};

function r_in_r(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateVisPos(eleIDNum) {
    var postoks = curPositions[eleIDNum].split("");
    var lr = postoks[0];
    var tb = postoks[1];

    var offsetTop;
    var offsetLeft;

    var eleID = TITLE_TEXT_BASE_ID + eleIDNum;
    var element = document.getElementById(eleID);
    var eleWidth  = element.offsetWidth;
    var eleHeight = element.offsetHeight;

    switch (lr) {
        case "l":
            offsetLeft = (maxWidth/2) - eleWidth;
            break;
        case "r":
            offsetLeft = (maxWidth/2);
            break;
        default:
            console.log("Something bad happened...");
    }

    switch (tb) {
        case "t":
            offsetTop = (maxHeight/2) - eleHeight;
            break;
        case "b":
            offsetTop = (maxHeight/2);
            break;
        default:
            console.log("Something bad happened...");
    }

    document.getElementById(eleID).style.top = offsetTop + "px";
    document.getElementById(eleID).style.left = offsetLeft + "px";
}

function switchTitleElements(ele1,ele2) {
    var pos1 = curPositions[ele1];
    curPositions[ele1] = curPositions[ele2];
    curPositions[ele2] = pos1;
}

function updateTitleElemPoss() {
    for (var i = 0; i < 4; i++) {
        updateVisPos(i);
    }
}

function rearrange() {
    let options = [0,1,2,3];
    var ele1 = options.splice(r_in_r(0,options.length-1),1);
    var ele2 = options.splice(r_in_r(0,options.length-1),1);

    switchTitleElements(ele1,ele2);
    updateTitleElemPoss();
}

function prepTitleElems() {
    for (var i = 0; i < 4; i++) {
        var eleID = TITLE_TEXT_BASE_ID + i;
        var element = document.getElementById(eleID);
        var offsetTop  = element.offsetTop;
        var offsetLeft = element.offsetLeft;
        document.getElementById(eleID).style.top  = offsetTop + "px";
        document.getElementById(eleID).style.left = offsetLeft + "px";
        document.getElementById(eleID).className  = "titleText";//NoTrans
    }
}

var rearrangeInterval;

function startRearranging() {
    prepTitleElems();
    rearrangeInterval = setInterval(rearrange, 400);
}

function condenseTitleElems() {
    var concat1 = document.getElementById(TITLE_TEXT_BASE_ID + "1").innerHTML;
    document.getElementById(TITLE_TEXT_BASE_ID + "0").innerHTML = document.getElementById(TITLE_TEXT_BASE_ID + "0").innerHTML + concat1;
    var parent1 = document.getElementById(TITLE_TEXT_BASE_ID + "1").parentNode;
    parent1.removeChild(document.getElementById(TITLE_TEXT_BASE_ID + "1"));
    var concat2 = document.getElementById(TITLE_TEXT_BASE_ID + "3").innerHTML;
    document.getElementById(TITLE_TEXT_BASE_ID + "2").innerHTML = document.getElementById(TITLE_TEXT_BASE_ID + "2").innerHTML + concat2;
    var parent2 = document.getElementById(TITLE_TEXT_BASE_ID + "3").parentNode;
    parent2.removeChild(document.getElementById(TITLE_TEXT_BASE_ID + "3"));
}

function finalizePositions() {
    var ele0Width = document.getElementById(TITLE_TEXT_BASE_ID + "0").clientWidth;
    var ele2Width = document.getElementById(TITLE_TEXT_BASE_ID + "2").clientWidth;
    var ele3Width = document.getElementById(TITLE_TEXT_BASE_ID + "3").clientWidth;

    document.getElementById(TITLE_TEXT_BASE_ID + "0").style.top = "0px";
    document.getElementById(TITLE_TEXT_BASE_ID + "0").style.left = "0px";

    document.getElementById(TITLE_TEXT_BASE_ID + "1").style.top = "0px";
    document.getElementById(TITLE_TEXT_BASE_ID + "1").style.left = ele0Width + "px";

    document.getElementById(TITLE_TEXT_BASE_ID + "2").style.top = "0px";
    document.getElementById(TITLE_TEXT_BASE_ID + "2").style.left = maxWidth - ele2Width - ele3Width + "px";

    document.getElementById(TITLE_TEXT_BASE_ID + "3").style.top = "0px";
    document.getElementById(TITLE_TEXT_BASE_ID + "3").style.left = maxWidth - ele3Width + "px";
}

function prepButtons() {
    document.getElementById(TITLE_TEXT_BASE_ID + "0").className = "titleTextButton";
    document.getElementById(TITLE_TEXT_BASE_ID + "1").className = "titleTextButton";
    document.getElementById(TITLE_TEXT_BASE_ID + "2").className = "titleTextButton";
    document.getElementById(TITLE_TEXT_BASE_ID + "3").className = "titleTextButton";
    assignEventListeners();
}

function finisedLoading() {
    clearInterval(rearrangeInterval);

    curPositions = initialPositions;
    updateTitleElemPoss();

    setTimeout(function () {
        console.log("Page loaded...");
        stillLoading = false;
        document.getElementById(TITLE_TEXT_BASE_ID + "0").className = "titleText";
        document.getElementById(TITLE_TEXT_BASE_ID + "1").className = "titleText";
        document.getElementById(TITLE_TEXT_BASE_ID + "2").className = "titleText";
        document.getElementById(TITLE_TEXT_BASE_ID + "3").className = "titleText";
        // condenseTitleElems();
        finalizePositions();
        prepButtons();
    }, 2000);
}

/******************************************************************************/
/*************************** MENU BUTTON HANDLERS *****************************/
/******************************************************************************/

var buttonImages = {
    0: "what",
    1: "about",
    2: "submit",
    3: "who"
}

var menuButtons = {
    0: false,
    1: false,
    2: false,
    3: false
}

function assignEventListeners() {
    document.getElementById(TITLE_TEXT_BASE_ID + "0").addEventListener('click',toggleMenuButton);
    document.getElementById(TITLE_TEXT_BASE_ID + "1").addEventListener('click',toggleMenuButton);
    document.getElementById(TITLE_TEXT_BASE_ID + "2").addEventListener('click',toggleMenuButton);
    document.getElementById(TITLE_TEXT_BASE_ID + "3").addEventListener('click',toggleMenuButton);
}

function toggleMenuButton(ev) {
    var targetID = ev.target.id;
    var targetNum = parseInt(targetID.split("")[targetID.length-1]);

    if (menuButtons[targetNum]) { // button was activated, so deactivate
        deactivateMenuButton(targetID,targetNum);
    }
    else { // button was off, so activate
        activateMenuButton(targetID,targetNum);
    }

    menuButtons[targetNum] = !menuButtons[targetNum];
}

function deactivateMenuButton(targetID, targetNum) {
    document.getElementById(targetID).className = "titleTextButton";
    document.getElementById(targetID).removeEventListener('mouseover',hoverMenuImage);

    var imgId = buttonImages[targetNum] + "Image";

    document.getElementById(imgId).style = null;
    document.getElementById(imgId).className = document.getElementById(imgId).className + " menuImgHidden";
}

function activateMenuButton(targetID, targetNum) {
    document.getElementById(targetID).className = "titleTextButtonOn";
    document.getElementById(buttonImages[targetNum] + "Image").addEventListener("mouseover",hoverMenuImage);
    console.log(targetID);


    var imgId = buttonImages[targetNum] + "Image";
    var minHeight  = document.getElementById(TITLE_TEXT_BASE_ID + "1").clientHeight;
    var topOffset  = r_in_r(minHeight,maxHeight - document.getElementById(imgId).clientHeight);
    var leftOffset = r_in_r(0,maxHeight - document.getElementById(imgId).clientWidth);

    document.getElementById(imgId).style.top  = topOffset  + "px";
    document.getElementById(imgId).style.left = leftOffset + "px";
    document.getElementById(imgId).className = document.getElementById(imgId).className.split(" ")[0]
}

var curCanv;
var curCtx;

var curCanvWidth;
var curCanvHeight;

var curCursorX;
var curCursorY;

var curImgBorders;
var checkCurImgBordersInterval;

var fuckUpInterval;

function imgToCanv(menuImg) {
    var imgID = menuImg.id;
    var menuImgWidth = menuImg.clientWidth;
    var menuImgHeight = menuImg.clientHeight;
    var menuImgLeft = menuImg.offsetLeft;
    var menuImgTop = menuImg.offsetTop;

    curImgBorders = {
        top:    menuImgTop,
        right:  menuImgLeft + menuImgWidth,
        bottom: menuImgTop  + menuImgHeight,
        left:   menuImgLeft
    };

    curCanv = document.createElement("canvas");
    curCtx  = curCanv.getContext("2d");
    // TODO: could add random sizing here
    curCanvWidth  = maxWidth;
    curCanvHeight = maxHeight;

    curCanv.width = maxWidth;
    curCanv.height = maxHeight;

    curCanv.className = "menuButtonCanvas";
    curCanv.id = menuImg.id;
    curCanv.style.zIndex = 100;
    curCanv.addEventListener('mousemove', menuButtonCanvMoveHandler);
    curCtx.drawImage(menuImg, menuImgLeft, menuImgTop, menuImgWidth, menuImgHeight);

    document.getElementById(imgID).style.display = "none";
    document.body.appendChild(curCanv);
}

function hoverMenuImage(ev) {
    var menuImg = ev.target;
    checkCurImgBordersInterval = setInterval(checkMenuButtonHoverOOB, 200);
    imgToCanv(menuImg);
    fuckUpDims = {
        top:    curImgBorders.top-10,
        right:  curImgBorders.right+10,
        bottom: curImgBorders.bottom+10,
        left:   curImgBorders.left-10
    };
    maxSkips = 100000;
    fuckUpInterval = setInterval(fuckUpStep, 5);
}

function stopHoverMenuImage() {
    console.log("Stopped hover!");
    var canvID = curCanv.id;
    document.getElementById(canvID).style.display = null;
    document.body.removeChild(curCanv);
    curCanv = null;
    curCtx = null;

    curCanvWidth = null;
    curCanvHeight = null;

    curCursorX = null;
    curCursorY = null;

    curImgBorders = null;
    if (checkCurImgBordersInterval) {
        clearInterval(checkCurImgBordersInterval);
    }

    fuckUpDims = null;
    if (fuckUpInterval) {
        clearInterval(fuckUpInterval);
    }
}

function checkMenuButtonHoverOOB() {
    if (curCursorX < curImgBorders.left || curCursorX > curImgBorders.right ||
        curCursorY < curImgBorders.top  || curCursorY > curImgBorders.bottom) {
        clearInterval(checkCurImgBordersInterval);
        stopHoverMenuImage();
    }
}

function menuButtonCanvMoveHandler(ev) {
    curCursorX = ev.clientX;
    curCursorY = ev.clientY;
}

function isInBounds(x,y) {
    return (x >= 0 && x <= curCanvWidth &&
            y >= 0 && y <= curCanvHeight);
}

function isTransparent(data) {
    return (data[3] == 0);
}

function isWhite(data) {
    return (data[0] > 210 && data[1] > 210 && data[2] > 210 && data[3] > 0);
}

function getNeighbors(x,y) {
    var nbrs = [];
    for (var i = -1; i < 2; i++) {
        for (var j = -1; j < 2; j++) {
            if (Math.abs(i) == Math.abs(j)) {
                continue;
            }
            var nX = x + i;
            var nY = y + j;
            var imgData = curCtx.getImageData(nX, nY, 1, 1).data;
            if ((isTransparent(imgData) || isWhite(imgData)) && isInBounds(nX,nY)) {
                nbrs.push([nX,nY]);
            }
        }
    }
    if (nbrs.length == 0) {
        return false;
    }
    var startRandSubset = r_in_r(0,nbrs.length-2);
    return nbrs.splice(startRandSubset,r_in_r(startRandSubset+1,nbrs.length-1));
}

function getImgData(x,y) {
    return curCtx.getImageData(x, y, 1, 1);
}

var fuckUpDims;

function fuckUpStep() {
    let numPerStep = 2000;
    var skips = 0;
    for (var i = 0; i < numPerStep; i++) {
        var curX = r_in_r(fuckUpDims.left-1,fuckUpDims.right+1);
        var curY = r_in_r(fuckUpDims.top-1,fuckUpDims.bottom+1);

        var curImgData = curCtx.getImageData(curX, curY, 1, 1);

        var tOrW = (isTransparent(curImgData.data) || isWhite(curImgData.data));

        if (tOrW) {
            continue;
        }

        var nbrs = getNeighbors(curX,curY);

        for (var j = 0; j < nbrs.length; j++) {
            let nbr = nbrs[j];
            if (nbr[0] < fuckUpDims.left) {
                fuckUpDims.left = nbr[0];
            }
            if (nbr[0] > fuckUpDims.right) {
                fuckUpDims.right = nbr[0];
            }
            if (nbr[1] < fuckUpDims.top) {
                fuckUpDims.top = nbr[1];
            }
            if (nbr[1] > fuckUpDims.bottom) {
                fuckUpDims.bottom = nbr[1];
            }
            var nbrImgData = curCtx.getImageData(nbr[0],nbr[0], 1, 1);
            curCtx.putImageData(curImgData,nbr[0],nbr[1]);
        }
    }
}

/******************************************************************************/
/*************************** INITIALIZATION ***********************************/
/******************************************************************************/

function initVars() {
    maxWidth  = window.innerWidth;
    maxHeight = window.innerHeight;
}

function init() {
    initVars();
    startRearranging();
    setTimeout(finisedLoading, r_in_r(2000,4000));
}

var resizeTimeout;

function resizeHandler() {
    if (resizeTimeout) {
        clearTimeout(resizeTimeout);
    }
    resizeTimeout = setTimeout(function () {
        initVars();
        if (stillLoading) {
            updateTitleElemPoss();
        }
        else {
            finalizePositions()
        }
        console.log("page resized");
    }, 50);
}

window.onload = init;
window.onresize = resizeHandler;
