var canvas;
var ctx;

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
}

function indexToCoord(ind) {
    var x = (ind % canvas.width);
    var y = ((ind - x) / canvas.width);
    return [x,y];
}

function coordToIndex(x,y) {
    return x + (y*canvas.width);
}

function newPoint(coord, color) {
    return {
        x: coord[0],
        y: coord[1],
        r: color[0],
        g: color[1],
        b: color[2],
        a: color[3]
    }
}

function getPoints() {
    var imgData = ctx.getImageData(0,0,canvas.width,canvas.height);
    var points = [];
    for (var i = 0; i < imgData.data.length; i+=4) {
        if (imgData.data[i + 3] > 0) {
            var coord = indexToCoord(i/4);
            var color = [
                imgData.data[i],
                imgData.data[i + 1],
                imgData.data[i + 2],
                imgData.data[i + 3]
            ];
            points.push(newPoint(coord, color));
        }
    }
    return points;
}

function drawPoints(rem) {
    console.log("drawPoints");

    for (var i = 0; i < rem; i++) {
        points.splice(randInt(0, points.length-1),1);
    }

    for (var i = 0; i < points.length; i++) {
        ctx.fillStyle = "rgba(" + points[i].r + "," + points[i].g + "," + points[i].b + "," + points[i].a + ")";
        ctx.fillRect(points[i].x + randInt(-dy,dy), points[i].y + (dy*2), 1,1);
    }
}

var points;
var dy = 1;
var drawInterval;

function init() {
    canvas = document.getElementById("canvas");


    ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;

    ctx.font="normal 400px Arial";
    ctx.textAlign="center";
    ctx.fillText("SUBMIT",canvas.width/2,canvas.height/2);

    points = getPoints();

    drawInterval = setInterval(function () {
        if (points.length > 0) {
            dy += 1;
            drawPoints(points.length/30);
        }
        else {
            clearInterval(drawPoints);
        }
    }, 10);
}

window.onload = init;
