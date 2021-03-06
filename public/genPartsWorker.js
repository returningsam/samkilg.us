importScripts('/assets/chance.min.js');

var windowWidth;
var windowHeight;
var canvWidth;
var usedColors;
var animCenter;

function indToCoord(i) {
    i = i/4;
    var x = i%canvWidth;
    var y = (i-x)/canvWidth;
    return [x,y];
}

function coordToInd(x,y) {
    return (((y*canvWidth)+x)*4);
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

function getColorID(color) {
    if (usedColors.indexOf(color) < 0) usedColors.push(color);
    return usedColors.indexOf(color);
}

function newPart(points) {
    var center = [0,0,];
    for (var i = 0; i < points.length; i++) {
        center[0] += points[i][0][0];
        center[1] += points[i][0][1];
    }
    center[0] = Math.round(center[0]/points.length);
    center[1] = Math.round(center[1]/points.length);

    var dx;
    var dy;

    var ddiv = 3.5;
    if (chance.bool()) {
        dx = chance.integer({min: -windowWidth/ddiv, max: windowWidth/ddiv});
        dy = chance.integer({min: -windowWidth/ddiv, max: windowWidth/ddiv});
    }
    else {
        dy = chance.integer({min: -windowWidth/ddiv, max: windowWidth/ddiv});
        dx = chance.integer({min: -windowWidth/ddiv, max: windowWidth/ddiv});
    }

    return {
        points: points,
        center: center,
        dx: dx,
        dy: dy,
        m: chance.floating({min:0.7,max:1.3})
    };
}

function getDist(x1,y1,x2,y2) {
    var a = x1 - x2;
    var b = y1 - y2;
    return Math.sqrt((a*a)+(b*b));
}

function genParts(imageData) {
    var allPoints = [];
    usedColors = [];
    for (var i = 0; i < imageData.data.length; i+=4) {
        if (imageData.data[i+3] > 0) {
            var c = imageData.data[i] + "," + imageData.data[i+1] + "," + imageData.data[i+2] + "," + imageData.data[i+3];
            allPoints.push([indToCoord(i),getColorID(c)]);
        }
    }

    // console.log("points processed...");
    if (allPoints.length < 1) {
        initContent();
        setTimeout(function () {
            genParts();
        }, 10);
        return;
    }

    animCenter = allPoints[chance.integer({min: 0, max: allPoints.length-1})];
    var allParts = [];

    /**************************************************************************/

    var numParts = 50;
    var numPointsPerPart = allPoints.length / numParts;

    // points preprocessing
    var coordDict = {};
    var numToProcess = allPoints.length;
    for (var i = 0; i < allPoints.length; i++) {
        var x = allPoints[i][0][0],y = allPoints[i][0][1];
        if (!coordDict[x])    coordDict[x]    = {};
        if (!coordDict[x][y]) coordDict[x][y] = [];
        coordDict[x][y] = i;
    }

    while (numToProcess > 0) {
        var xCoords = Object.keys(coordDict);
        var startX = xCoords[chance.integer({min: 0, max: xCoords.length-1})];
        var yCoords = Object.keys(coordDict[startX]);
        if (yCoords.length < 1) {
            delete coordDict[startX];
            continue;
        }
        var startY = yCoords[chance.integer({min: 0, max: yCoords.length-1})];

        var partPoints = [];
        partPoints.push(coordDict[startX][startY]);
        delete coordDict[startX][startY];
        while (partPoints.length < numPointsPerPart) {
            var curX = allPoints[partPoints[partPoints.length-1]][0][0];
            var curY = allPoints[partPoints[partPoints.length-1]][0][1];
            var nbrs = [];
            for (var diffX = -1; diffX <= 1; diffX++) {
                for (var diffY = -1; diffY <= 1; diffY++) {
                    if (diffX == 0 && diffY == 0) continue;
                    var newX = curX + diffX;
                    var newY = curY + diffY;
                    if (coordDict[newX] && coordDict[newX][newY]) {
                        nbrs.push([newX,newY,coordDict[newX][newY]]);
                        continue;
                    }
                }
            }
            if (nbrs.length > 0) {
                var nbr = nbrs[chance.integer({min:0,max:nbrs.length-1})];
                partPoints.push(nbr[2]);
                delete coordDict[nbr[0]][nbr[1]];
            }
            else break;
        }
        numToProcess -= partPoints.length;
        partPoints = partPoints.map((a) => allPoints[a]);
        var part = newPart(partPoints);
        allParts.push(part);
    }

    return {allParts:allParts,animCenter:animCenter,usedColors:usedColors};
}

self.addEventListener('message', function(e) {
    var data = e.data;
    switch (data.cmd) {
        case 'gen':
            var imageData = data.msg.imageData;

            canvWidth    = data.msg.canvWidth;
            windowWidth  = data.msg.windowWidth;
            windowHeight = data.msg.windowHeight;

            var newData = genParts(imageData);
            self.postMessage(newData);
            break;
        default:
            self.postMessage('Unknown command: ' + data.msg);
    };
}, false);


// console.log("loaded");
