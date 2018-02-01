/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 */
function r_in_r(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function nextColor() {
  for (var i = 0; i < curColor.length; i++) {
    if (curColor[i] > 253) {
      curColor[i] = curColor[i] - r_in_r(0,MAX_CHANGE);
    }
    else if (curColor[i] < 2) {
      curColor[i] = curColor[i] + r_in_r(0,MAX_CHANGE);
    }
    else {
      curColor[i] = curColor[i] + r_in_r(-MAX_CHANGE,MAX_CHANGE);
    }
  }
}

function colorToString() {
  return "rgb(" + curColor[0] + ", " + curColor[1] + ", " + curColor[2] + ")";
}

/*******************************************************************************
***************************** Canvas Fill **************************************
*******************************************************************************/

// This is a modified "Game of Life" simulation.
// More info found here: http://www.conwaylife.com/w/index.php?title=Maze

const RATIO_MULT = 2;

var started = false;

var grid;
var tempGrid;
var maxHeight;
var maxWidth;

var dotSize;

var canv;
var ctx;

var SURVIVES = [3, 5, 6, 4, 1];
var CREATES = [3];

var drawInterval;

var printTimeout;
var drawTimeout;

var lightFill = "#333";

var curColor = [r_in_r(10,240),r_in_r(10,240),r_in_r(10,240)];

var MAX_CHANGE = 20;

function randomLife() {
  SURVIVES = [];
  CREATES = [];
  for (var i = 0; i < r_in_r(1,8); i++) {
    var newInt = r_in_r(1,8);
    while (SURVIVES.indexOf(newInt) > -1) {
      newInt = r_in_r(1,8);
    }
    SURVIVES.push(newInt);
  }
  for (var i = 0; i < r_in_r(1,8); i++) {
    var newInt = r_in_r(1,8);
    while (CREATES.indexOf(newInt) > -1) {
      newInt = r_in_r(1,8);
    }
    CREATES.push(newInt);
  }
  // console.log(SURVIVES);
  // console.log(CREATES);
}

/**
 * Counts the number of live nodes around a spot in the grid
 * @param  {int} xCoord x coordinate of the spot to check
 * @param  {int} yCoord y coordinate of the spot to check
 * @return {int}        neighbor count
 */
function getNeighbs(xCoord,yCoord) {
  var neighbs = 0;
  for (var x = -1; x < 2; x++) {
    for (var y = -1; y < 2; y++) {
      if (!(y == 0 && x == 0) &&
          grid[xCoord + x] &&
          grid[xCoord + x][yCoord + y] &&
          grid[xCoord + x][yCoord + y][0] == 1) {
        neighbs++;
      }
    }
  }
  return neighbs;
}

/**
 * Calls the getNeighbs function to check if a node will survive or not.
 * @param  {int} x     x coordinate of the spot to check
 * @param  {int} y     y coordinate of the spot to check
 * @return {Boolean}   true if the node survives; false otherwise
 */
function isSurvive(x,y) {
  return (SURVIVES.indexOf(getNeighbs(x,y)) > -1);
}

/**
 * Calls the getNeighbs function to check if a node will spawn or not.
 * @param  {int} x     x coordinate of the spot to check
 * @param  {int} y     y coordinate of the spot to check
 * @return {Boolean}   true if the node spawns; false otherwise
 */
function isCreate(x,y) {
  return (CREATES.indexOf(getNeighbs(x,y)) > -1);
}

/**
 * Iterates over the nodes and computes the next generation of the grid.
 */
function nextGen() {
  ctx.fillStyle = "black";
  ctx.fillRect(0,0,maxWidth * RATIO_MULT,maxHeight * RATIO_MULT);
  tempGrid = [];
  for (var i = 0; i < grid.length; i++) {
    tempGrid[i] = [];
    for (var j = 0; j < grid[i].length; j++) {
      tempGrid[i][j] = [0,0];
    }
  }

  for (var x = 0; x < grid.length; x++) {
    for (var y = 0; y < grid[x].length; y++) {
      tempGrid[x][y] = grid[x][y];
    }
  }

  //console.log("generating");
  var changes = 0;
  for (var x = 0; x < grid.length; x++) {
    for (var y = 0; y < grid[x].length; y++) {
      if (grid[x][y][0] == 1 && !isSurvive(x,y)) {
        tempGrid[x][y] = [0,1];
        changes++;
      }
      else if (grid[x][y][0] == 0 && isCreate(x,y)) {
        tempGrid[x][y] = [1,1];
        changes++;
      }
    }
  }
  if (changes == 0) {
    started = false;
    clearInterval(drawInterval);
  }
  else {
    for (var x = 0; x < grid.length; x++) {
      for (var y = 0; y < grid[x].length; y++) {
        grid[x][y] = tempGrid[x][y];
      }
    }
  }
}

/**
 * Draws a generation of the grid.
 */
function nextDraw() {
  ctx.clearRect(0,0,maxWidth * RATIO_MULT,maxHeight * RATIO_MULT);
  ctx.fillStyle = "black";
  ctx.fillRect(0,0,maxWidth * RATIO_MULT,maxHeight * RATIO_MULT);
  nextColor();
  for (var x = 0; x < grid.length; x++) {
    for (var y = 0; y < grid[x].length; y++) {
      if (grid[x][y][1] == 1) {
        if (grid[x][y][0] == 1) {
          ctx.fillStyle = colorToString();
          ctx.fillRect(x * RATIO_MULT*dotSize,y * RATIO_MULT*dotSize,dotSize * RATIO_MULT,dotSize * RATIO_MULT);
        }
        else if (grid[x][y][0] == 0) {
          ctx.fillStyle = "#000";
          ctx.fillRect(x * RATIO_MULT*dotSize,y * RATIO_MULT*dotSize,dotSize * RATIO_MULT,dotSize * RATIO_MULT);
          ctx.fillStyle = lightFill;
        }
        grid[x][y][1] = 0;
      }
    }
  }
}


/**
 * Inserts a live node into the grid and starts the simulation.
 * @param  {int} x x coordinate to put a dot.
 * @param  {int} y y coordinate to put a dot.
 */
function putDot(x,y) {
  grid[x][y] = [1,1];

  ctx.fillStyle = colorToString();
  ctx.fillRect(x * RATIO_MULT*dotSize,y * RATIO_MULT*dotSize,dotSize * RATIO_MULT,dotSize * RATIO_MULT);

  if (!started) {
    started = true;
    drawTimeout = setTimeout(function () {
      drawInterval = setInterval(function () {
        nextGen();
        nextDraw();
      }, 1);
    }, 100);
  }
}

/**
 * Creates an empty grid to start the simulation.
 */
function initGrid() {
  grid = [];
  for (var i = 0; i < maxWidth/dotSize; i++) {
    grid[i] = [];
    for (var j = 0; j < maxHeight/dotSize; j++) {
      grid[i][j] = [0,0];
    }
  }
}

/**
 * Handles mouse movements. Places live nodes where the mouse goes.
 * @param  {[type]} mEvent [description]
 * @return {[type]}        [description]
 */
function canvMouseEventListener(mEvent) {
  var rect = canv.getBoundingClientRect();
  var x = mEvent.clientX - rect.left;
  var y = mEvent.clientY - rect.top;
  clearInterval(drawInterval);
  clearTimeout(drawTimeout);
  started = false;
  putDot(Math.round(x/dotSize),Math.round(y/dotSize));
}

function initX() {
  for (var i = 1; i < 100; i++) {
    var ch = i;
    putDot(Math.round(grid.length/2)+ch,Math.round(grid[0].length/2)+ch);
    putDot(Math.round(grid.length/2)-ch,Math.round(grid[0].length/2)-ch);
  }
  for (var i = 1; i < 100; i++) {
    var ch = i;
    putDot(Math.round(grid.length/2)+ch,Math.round(grid[0].length/2)-ch);
    putDot(Math.round(grid.length/2)-ch,Math.round(grid[0].length/2)+ch);
  }
}

function init_plus() {
  for (var i = 1; i < 100; i++) {
    var ch = i;
    putDot(Math.round(grid.length/2),Math.round(grid[0].length/2)+ch);
    putDot(Math.round(grid.length/2),Math.round(grid[0].length/2)-ch);
  }
  for (var i = 1; i < 100; i++) {
    var ch = i;
    putDot(Math.round(grid.length/2)+ch,Math.round(grid[0].length/2));
    putDot(Math.round(grid.length/2)-ch,Math.round(grid[0].length/2));
  }
}

/**
 * Resets the canvas. Called when the grid is clicked.
 */
function resetCanvas() {
  clearInterval(drawInterval);
  started = false;
  for (var x = 0; x < grid.length; x++) {
    for (var y = 0; y < grid[x].length; y++) {
      grid[x][y] = [0,1];
    }
  }
  nextDraw();
}

/**
 * Initializes the canvas and the simulation in a whole.
 */
function initCanv() {
  maxWidth = window.innerWidth;
  maxHeight = window.innerHeight;

  canv = document.getElementById('canvas');
  canv.width = maxWidth * RATIO_MULT;
  canv.height = maxHeight * RATIO_MULT;
  ctx = canv.getContext('2d');
  ctx.fillStyle = "black";
  ctx.fillRect(0,0,maxWidth * RATIO_MULT,maxHeight * RATIO_MULT);

  dotSize = (maxWidth/1000);
  initGrid();

  canv.addEventListener('mousemove',canvMouseEventListener);
  canv.addEventListener('click',resetCanvas);
  console.log("You can draw on that black box over there by hoving your mouse over it. Click anywhere in the black box to reset the canvas. To randomize the pattern being drawn, just run this function: 'randomLife()'. Then just draw some more!");

  initX();
  //setInterval(nextColor,100)
}

function downloadCanvas() {
  window.open(document.getElementById('canvas').toDataURL('image/png'),'_blank');
}

window.onload = initCanv;
