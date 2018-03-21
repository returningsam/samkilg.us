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

    var choice = chance.integer({min: 0,max: 3});
    // var choice = 2;

    if (choice == 0) {
        var numParts = chance.integer({min: 400, max: 600});
        var numPointsPerPart = allPoints.length / numParts;

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
        var numParts = chance.integer({min: 1000, max: 1200});
        numPointsPerPart = allPoints.length / numParts;
        shuffle(allPoints);
        while (allPoints.length > 0)
            allParts.push(newPart(allPoints.splice(0,Math.min(numPointsPerPart+1,allPoints.length))));
    }
    else if (choice == 2) {
        var numParts = chance.integer({min: 500, max: 700});
        numPointsPerPart = allPoints.length / numParts;

        var stPoint = allPoints[chance.integer({min: 0, max: allPoints.length-1})];
        var xDiff = chance.floating({min: -2, max: 2});
        var yDiff = chance.floating({min: -2, max: 2});
        var sortMult = function(a, b) {
            return ((xDiff*a[0][0])*(yDiff*a[0][1])) - ((xDiff*b[0][0])*(yDiff*b[0][1]));
        }
        var sortDiv = function(a, b) {
            return ((xDiff*a[0][0])/(yDiff*a[0][1])) - ((xDiff*b[0][0])/(yDiff*b[0][1]));
        }

        if (chance.bool()) allPoints.sort(sortMult);
        else allPoints.sort(sortDiv);

        while (allParts.length < numParts && allPoints.length > 1)
            allParts.push(newPart(allPoints.splice(0,Math.min(numPointsPerPart+1,allPoints.length))));
    }
    else if (choice == 3) {
        var numParts = chance.integer({min: 500, max: 1000});
        numPointsPerPart = allPoints.length / numParts;

        var stPoint = allPoints[chance.integer({min: 0, max: allPoints.length-1})];
        var xDiff = chance.floating({min: -2, max: 2});
        var yDiff = chance.floating({min: -2, max: 2});
        var sortByX = function(a, b) {
            return ((xDiff*a[0][0])) - ((xDiff*b[0][0]));
        }
        var sortByY = function(a, b) {
            return ((xDiff*a[0][1])) - ((xDiff*b[0][1]));
        }
        var curSort = chance.bool();
        if (curSort) allPoints.sort(sortByX);
        else allPoints.sort(sortByY);

        while (allPoints.length > 1) {
            var stPoint = chance.integer({min: 0, max: allPoints.length-1});
            allParts.push(newPart(allPoints.splice(stPoint,Math.min(numPointsPerPart+1,allPoints.length-stPoint+1))));
            if (chance.bool({likelihood: 10})) {
                curSort = !curSort;
                if (curSort) allPoints.sort(sortByX);
                else allPoints.sort(sortByY);
            }
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
