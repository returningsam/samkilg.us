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
    var cx = 0;
    var cy = 0;
    for (var i = 0; i < points.length; i++) {
        cx += points[i][0][0];
        cy += points[i][0][1];
    }
    cx = cx / points.length;
    cy = cy / points.length;
    var cDist = parseFloat(getDist(cx,cy,animCenter[0][0],animCenter[0][1]).toFixed(2));

    return {
        points: points,
        cDist: cDist,
        dx: chance.integer({min: -windowWidth/1.5, max: windowWidth/1.5}),
        dy: chance.integer({min: -windowHeight/1.5, max: windowHeight/1.5}),
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

    console.log("points processed...");
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

    var choice = chance.integer({min: 0,max: 1});
    var numParts;
    var numPointsPerPart;
    if (choice == 0) {
        numParts = chance.integer({min:500, max: 700});
        numPointsPerPart = allPoints.length / numParts;

        var stPoint = allPoints[chance.integer({min: 0, max: allPoints.length-1})];
        allPoints.sort(function(a, b) {
            var distA = getDist(a[0][0],a[0][1],stPoint[0][0],stPoint[0][1]);
            var distB = getDist(b[0][0],b[0][1],stPoint[0][0],stPoint[0][1]);
            return distA - distB;
        });

        while (allParts.length < numParts && allPoints.length > 1) {
            allParts.push(newPart(allPoints.splice(0,Math.min(numPointsPerPart+1,allPoints.length))));

            if (chance.bool({likelihood: 10}) && allPoints.length > 1) {
                var stPoint = allPoints[chance.integer({min: 0, max: allPoints.length-1})];
                allPoints.sort(function(a, b) {
                    var distA = getDist(a[0][0],a[0][1],stPoint[0][0],stPoint[0][1]);
                    var distB = getDist(b[0][0],b[0][1],stPoint[0][0],stPoint[0][1]);
                    return distA - distB;
                });
            }
        }
    }
    else if (choice == 1) {
        var numParts = chance.integer({min: 100, max: 200});
        numPointsPerPart = allPoints.length / numParts;

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


console.log("loaded");
