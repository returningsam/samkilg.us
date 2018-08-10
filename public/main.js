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

function getParentByClass(el,parentClass) {
    while (!el.classList.contains(parentClass)) {
        if (el.tagName == "BODY") return false;
        el = el.parentNode;
    }
    return el;
}

function getParentByTag(el,parentTag) {
    while (el.tagName.toLowerCase() != parentTag) {
        if (el.tagName == "BODY") return false;
        el = el.parentNode;
    }
    return el;
}

function getBodyScrollTop () {
    return Math.max(window.pageYOffset,
                    document.documentElement.scrollTop,
                    document.body.scrollTop);
}

function insertAsFirstChild(parent,child) {
    parent.insertBefore(child, parent.firstChild);
}

function roundTo(n, digits) {
    if (digits === undefined) digits = 0;

    var multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    var test =(Math.round(n) / multiplicator);
    return +(test.toFixed(digits));
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
        initSplashContent();
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
        if (curDist <= minDist) {
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
var focusPointTween;
var mouseMoveTime = 0.5;

function updateFocusPoint() {
    if (TweenMax.isTweening(focusPointTween)) {
        focusPointTween.updateTo({x:mouseX,y:mouseY});
    }
    else {
        focusPointTween = TweenMax.to(focusPoint,mouseMoveTime,{
            x: mouseX,
            y: mouseY,
            easing: Linear.easeInOut
        });
        mouseMoveTime = 0.01;
    }
}

function drawFocusPoint() {
    updateFocusPoint();
    focusPointEl.style.left   = roundTo(focusPoint.x,2) + "px";
    focusPointEl.style.top    = roundTo(focusPoint.y,2) + "px";
}

function genFocusPoint() {
    if (!focusPoint) {
        focusPoint = {
            x: mouseX,
            y: mouseY,
            push: 0,
            r: 25,
            jitter: 0
        }
        focusPointTween = TweenMax.to(focusPoint,1,{
            push: 100,
            easing: Quad.easeInOut
        });
    }
}

function enableLinkCursor() {focusPointEl.classList.add("link");}
function disableLinkCursor() {focusPointEl.classList.remove("link");}
function enableTextCursor() {focusPointEl.classList.add("text");}
function disableTextCursor() {focusPointEl.classList.remove("text");}


function addFocusPointListener(el,isLink) {
    if (isLink) {
        el.removeEventListener("mouseover",enableLinkCursor);
        el.addEventListener("mouseover",enableLinkCursor);
        el.removeEventListener("mouseleave",disableLinkCursor);
        el.addEventListener("mouseleave",disableLinkCursor);
    }
    else {
        el.removeEventListener("mousemove",enableTextCursor);
        el.addEventListener("mousemove",enableTextCursor);
        el.removeEventListener("mouseleave",disableTextCursor);
        el.addEventListener("mouseleave",disableTextCursor);
    }
}

function initFocusPointEventListeners() {
    var links = document.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) addFocusPointListener(links[i],true);

    var textElements = document.getElementsByTagName("p");
    for (var i = 0; i < textElements.length; i++) {
        addFocusPointListener(textElements[i],false);
    }
}

var FPClickTween;

function handleGeneralMouseDown() {
    if (TweenMax.isTweening(FPClickTween)) {
        FPClickTween.updateTo({
            push: 30
        },true);
    }
    else {
        FPClickTween = TweenMax.to(focusPoint,0.4,{
            push: 30,
            easing: Quad.easeInOut
        });
    }

    focusPointEl.classList.add("click");
}

function handleGeneralMouseUp() {
    if (TweenMax.isTweening(FPClickTween)) {
        FPClickTween.updateTo({
            push: 100
        },true);
    }
    else {
        FPClickTween = TweenMax.to(focusPoint,0.7,{
            push: 100,
            easing: Quad.easeInOut
        });
    }
    focusPointEl.classList.remove("click");
}

function initFocusPoint() {
    focusPointEl = document.getElementById("focusPoint");
    if (isMobile) focusPointEl.style.display = "none";
    else {
        genFocusPoint();
        drawFocusPoint();
        focusPointUpdateInterval = setInterval(drawFocusPoint, 10);
        document.body.addEventListener("mousedown",handleGeneralMouseDown);
        document.body.addEventListener("mouseup",handleGeneralMouseUp);
    }
}

/******************************************************************************/
/*************************** PROJECTS *****************************************/
/******************************************************************************/

const projData = [
    {
        title: "Julia Schafer",
        desc: "A portfolio/blog for Julia Schafer. This site features an interactive 3D liquid text element created with <a href='https://threejs.org/' target='_blank'>Three.js</a>, as well as a hand crafted CMS that allows dynamic content and code-free style editing.",
        link: "http://juliaschaefer.ch",
        role: "Site Development, Interaction Design",
        preview: "still_julia_schafer.jpg",
        gif: "julia_schafer.gif"
    },
    {
        title: "Dennis6E",
        desc: "A website for <a href='https://beta.p-e-o-p-l-e.com/recording/not-supposed' target='_blank'>Serengeti's</a> new album, Dennis6E, the final installment of the Kenny Dennis saga. Using WebGL, an interactive video element emulates the act of fast-forwarding and rewinding a VHS tape. Created in collaboration with <a href='http://noideas.biz' target='_blank'>No Ideas</a>.",
        link: "http://dennis6e.com",
        role: "Site Development, Interaction Design",
        preview: "still_not_supposed.jpg",
        gif: "not_supposed.gif"
    },
    {
        title: "WKNY Design",
        desc: "A collaboration with <a href='http://noideas.biz' target='_blank'>No Ideas</a> to create a new homepage for Weiden and Kennedy's New York design department. My efforts were focused on adding interactivity to the website to show the studio's willingness to break rules and create the unexpected.",
        link: "http://wknydesign.com",
        role: "Site Development, Interaction Design",
        preview: "still_wkny.jpg",
        gif: "wkny.gif"
    },
    {
        title: "gl-ph",
        desc: "The home of the inaugural submission call for gl-ph, the first undergraduate literary journals in the nation dedicated exclusively to the publication of digital literature. The text-only graphic elements and plentiful interactivity were designed to illustrate the dynamic and surprising nature of the 'digital  literature'.",
        link: "http://gl-ph.com",
        role: "Site Design & Development",
        preview: "still_glph.jpg",
        gif: "glph.gif"
    },
    {
        title: "brb",
        desc: "A convenient utility to notify others where you are when you leave your workspace. It was thought up by <a href='https://cole.works' target='_blank'>Cole Johnson</a> and populated with illustrations by <a href='https://dasha.design' target='_blank'>Dasha Buduchina</a>.",
        link: "http://illbrb.com",
        role: "Site Design & Development",
        preview: "still_brb.jpg",
        gif: "brb.gif"
    },
    {
        title: "Random Friends",
        desc: "Hoping to remedy the impersonal nature of having a web presence, this tool generates a link that, when visited, will randomly redirect to one of the links provided. This interconnectedness creates a sense of community and make it easier to find other amazing people on 'the web'.",
        link: "https://samkilg.us/friends",
        role: "Site Design & Development",
        preview: "friends.png"
    }
];

var curProjRotate;

function positionProjectBoxes() {
    var projBoxes = document.getElementsByClassName("box");
    for (var i = 0; i < projBoxes.length; i++) {
        var maxPerc = 100;
        maxPerc -= Math.min(100,100*((projBoxes[i].offsetWidth + 40)/window.innerWidth));
        if (!projBoxes[i].style.marginRight)
            projBoxes[i].style.marginRight = chance.integer({min:0,max:maxPerc}) + "%";
    }
}

function showProjGif(ev) {
    var targetBox = getParentByClass(ev.target,"box");
    var targInd = parseInt(targetBox.id.split("_")[1]);
    ev.target.src = "assets/project_previews/" + projData[targInd].gif;
    focusPointEl.classList.add("link");
}

function hideProjGif(ev) {
    var targetBox = getParentByClass(ev.target,"box");
    var targInd = parseInt(targetBox.id.split("_")[1]);
    ev.target.src = "assets/project_previews/" + projData[targInd].preview;
    focusPointEl.classList.remove("link");
}

function previewClickHandler(ev) {
    var projInd = parseInt(ev.target.id.split("_")[1]);
    window.open(projData[projInd].link,"_blank");
}

function addProjects() {
    var projectsCont = document.getElementById("projectsCont");
    for (var i = 0; i < projData.length; i++) {
        if (document.getElementById("proj_" + i)) continue;
        projBoxCont = document.createElement("div");
        projBoxCont.classList.add("boxCont");

        projBox = document.createElement("div");
        projBox.id = "proj_" + i;
        projBox.classList.add("box");

        // title

        var projTitleCont = document.createElement("a");
        projTitleCont.classList.add("boxTitle");
        projTitleCont.href = projData[i].link;
        projTitleCont.target = "_blank";
        var projTitle     = document.createElement("span");
        projTitle.classList.add("titleText");
        projTitle.innerHTML = projData[i].title;
        var projTitleLI     = document.createElement("span");
        projTitleLI.classList.add("linkIcon");
        projTitleLI.innerHTML = "visit &rarr;";

        projTitleCont.appendChild(projTitle);
        projTitleCont.appendChild(projTitleLI);
        projBox.appendChild(projTitleCont);

        // preview

        var projPreviewCont = document.createElement("div");
        projPreviewCont.classList.add("previewCont");
        var projPreview = document.createElement("img");
        if (projData[i].gif) {
            var gifImg = new Image();
            gifImg.src = "assets/project_previews/" + projData[i].gif;
            projPreview.addEventListener("mouseover",showProjGif);
            projPreview.addEventListener("mouseleave",hideProjGif);
        }
        projPreview.src = "assets/project_previews/" + projData[i].preview;
        projPreview.id = "prev_" + i;
        projPreview.addEventListener("click",previewClickHandler);
        projPreviewCont.appendChild(projPreview);

        projBox.appendChild(projPreviewCont);

        // description

        var projDescCont  = document.createElement("div");
        projDescCont.classList.add("boxDesc");
        var projDesc     = document.createElement("p");
        projDesc.innerHTML = projData[i].desc;

        var projRole     = document.createElement("p");
        projRole.innerHTML = projData[i].role;
        projRole.classList.add("secondary");


        projDescCont.appendChild(projDesc);
        projDescCont.appendChild(projRole);
        projBox.appendChild(projDescCont);

        projBoxCont.appendChild(projBox);
        projectsCont.appendChild(projBoxCont);
    }
    initFocusPointEventListeners();
}

function createProjectBoxes() {
    // clear projects just in case
    var projectsCont = document.getElementById("projectsCont");
    projectsCont.innerHTML = "";
    addProjects();
}

function initProjects() {
    createProjectBoxes();
    positionProjectBoxes();
    window.addEventListener("wheel",handleMainScroll,false);
    document.getElementById("projScrollCont").addEventListener("wheel",restrictWheel,false);
}

function restrictWheel(ev) {
    ev.preventDefault();
    // return false;
}

/******************************************************************************/
/*************************** EVENT HANDLERS ***********************************/
/******************************************************************************/

var curProjScroll = 0;

function updateMousePos(ev) {
    if (mouseX != ev.clientX || mouseY != ev.clientY) {
        mouseX = ev.clientX;
        mouseY = ev.clientY;
    }

    var hoveringProj = (getParentByClass(ev.target,"box") && true);
    if (hoveringProj) focusPointEl.style.transform = "rotate(" + curProjRotate + "deg) translate(-50%, -50%)";
    else focusPointEl.style.transform = null;
}

function tweenScrollUpdateHandler() {
    var menuCont = document.getElementById("menuCont");
    menuCont.style.top = Math.min(window.innerHeight - 40,Math.max(40,window.innerHeight + curScroll.targ)) + "px";
    projectsCont.style.top = (window.innerHeight*2 + curScroll.targ) + "px";

    if (curScroll.targ < window.innerHeight*2) {
        curProjRotate = Math.sin((-curScroll.targ / (window.innerHeight*2)) * Math.PI) * 5;

        projectsCont.style.transformOrigin = "center " + ((-curScroll.targ) - window.innerHeight*1.5) + "px";
        projectsCont.style.transform = "rotate(" + curProjRotate + "deg)";
    }
}

var scrollTween;
var curScroll = {};

function tweenScroll(targ) {
    if (TweenMax.isTweening(scrollTween)) {
        scrollTween.updateTo({
            targ: targ,
        },false);
    }
    else {
        scrollTween = TweenMax.to(curScroll,0.25,{
            targ: targ,
            easing: Sine.easeOut,
            onUpdate: tweenScrollUpdateHandler
        });
    }
}

function handleMainScroll(ev) {
    curProjScroll = Math.min(0,Math.max(-(projectsCont.clientHeight + window.innerHeight),curProjScroll - ev.deltaY));
    ev.preventDefault();

    tweenScroll(curProjScroll);
}

/******************************************************************************/
/*************************** RESIZING *****************************************/
/******************************************************************************/

var resizeTimeout;

function resize() {
    fixMainContentHeight();
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
        initFocusPoint();
        initCanv();
        createProjectBoxes();
        setTimeout(function () {
            initSplashContent();
            positionProjectBoxes();
            genPartsAsync(function () {
                updateMinDist();
            });
        }, 10);
    }, 200);
}

window.onresize = resize;

/******************************************************************************/
/*************************** INITIALIZATION ***********************************/
/******************************************************************************/

function initSplashContent() {
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
        initMainContent();
        setInterval(updateParts, 10);
    });
}

function fixMainContentHeight() {
    if (isMobile) {
        document.getElementById("main").style.top = 40 + "px";
        document.getElementById("menuCont").style.top = 0;
    }
}

function initMainContent() {
    fixMainContentHeight();
    document.getElementById("menuCont").addEventListener("mouseenter",function () {
        canvasInteraction = false;
    });
    document.getElementById("menuCont").addEventListener("mouseleave",function () {
        canvasInteraction = true;
    });
    document.getElementById("projectsCont").addEventListener("mouseenter",function () {
        canvasInteraction = false;
    });
    document.getElementById("projectsCont").addEventListener("mouseleave",function () {
        canvasInteraction = true;
    });
    if (!isMobile) initProjects();
    else document.getElementById("projectsMessage").innerHTML =
        "Visit this page on a non-mobile device to see my projects.";
    window.scrollTo(0,0);
}

function init() {
    isMobile = checkMobile();
    if (!isMobile) {
        updateMinDist();
        initCanv();
        initSplashContent();
        initParts();
        document.getElementById("mobileText").style.display = "none";
    }
    else {
        setTimeout(() => {
            document.body.classList.remove("loading");
        }, 500);
        initFocusPoint();
        initMainContent();
    }
}

window.onload = init;
