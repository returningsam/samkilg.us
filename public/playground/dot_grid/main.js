var numX = 50;
var numY = 50;

function newDot() {
    var w = (window.innerWidth  / numX)/2;
    var h = (window.innerHeight / numY)/2;

    var dot = document.createElement("div");
    dot.classList.add("dot");
    dot.style.height = Math.min(h,w) + "px";
    dot.style.width  = Math.min(h,w) + "px";
    if (h > w) {
        var m = (h-w);
        dot.style.marginLeft = m + "px";
        dot.style.marginRight = m + "px";
    }
    else if (w > h) {
        var m = (w-h);
        dot.style.marginTop = m + "px";
        dot.style.marginBottom = m + "px";
    }
    return dot;
}

function initDots() {
    var numDots = numX*numY*2;
    for (var i = 0; i < numDots; i++) {
        var dot = newDot();
        document.getElementById("dotCont").appendChild(dot);
    }
}

function init() {
    initDots();
}

window.onload = init;
