/*******************************************************************************
***************************** Paralax Thing ************************************
*******************************************************************************/

var midY;
var MOVE_MULT = 0.08;
var sElems = {};
var animRemoved = false;

var pallets = [
  ["#8DB500","#00856A","#005869"],
  ["#26C9F4","#20A3D5","#011B68"],
  ["#FFD34E","#DB9E36","#BD4932"],
  ["#FF5434","#CC1E2C","#731630"]
];

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

function fixElement(elem) {
  var posY = elem.getBoundingClientRect().top;
  elem.style.position = "fixed";
  elem.style.top = posY + "px";
  sElems[elem.id] = {posY: posY};
}

function fixElements() {
  var animEls = document.getElementsByClassName('anim');
  for (var i = 0; i < animEls.length; i++) {
    if (!animEls[i].id) {
      var x = 0;
      while (document.getElementById('temp' + x)) {
        x++;
      }
      animEls[i].id = 'temp' + x;
    }
    fixElement(animEls[i]);
  }
}

function getHeight(classes) {
  for (var i = 0; i < classes.length; i++) {
    if (classes[i].indexOf("height") > -1) {
      return parseInt(classes[i].replace("height",""));
    }
  }
}

function updateElement(elem,difY) {
  var height = getHeight(elem.className.split(" "));

  var mvY = difY * height;

  document.getElementById(elem.id).style.top = (sElems[elem.id].posY + mvY) + "px";
}

function updateElements(difY) {
  var animEls = document.getElementsByClassName('anim');

  for (var i = 0; i < animEls.length; i++) {
    updateElement(animEls[i],difY);
  }

  setTimeout(function () {
    if (!animRemoved) {
      animRemoved = true;
      for (var i = 0; i < animEls.length; i++) {
        animEls[i].style.transition = "none";
      }
    }
  }, 1000);
}

function devOrientHandler(tEvent) {
  var tiltFB = tEvent.beta;
  //console.log(tiltFB);
  if (tiltFB < 0.5 && tiltFB > -0.5) {
    colorBars();
  }
  updateElements(tiltFB);
}

function mMoveHandler(mEvent) {
  var curY = mEvent.clientY;
  var refRect = document.getElementsByClassName('four')[0].getBoundingClientRect();
  var minY = refRect.top;
  var maxY = refRect.bottom;
  //console.log(minY,maxY,curY);
  var difY = 0;
  if (curY < minY) {
    difY = curY - minY;
  }
  else if (curY > maxY) {
    difY = curY - maxY;
  }
  else {
    colorBars();
  }
  updateElements(difY * MOVE_MULT);
}

function initVals() {
  midY = window.innerHeight/2;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 */
function r_in_r(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function colorBars() {
  var newPal = pallets[r_in_r(0,pallets.length-1)];
  var pallet = [newPal[0],newPal[1],newPal[2]];
  var animEls = document.getElementsByClassName('anim');
  for (var i = 0; i < animEls.length; i++) {
    animEls[i].style.backgroundColor = pallet.splice(0,1)[0];
  }
  //console.log(pallets);
}

/*******************************************************************************
***************************** Canvas Fill **************************************
*******************************************************************************/

// This is a modified "Game of Life" simulation.
// More info found here: http://www.conwaylife.com/w/index.php?title=Maze

var started = false;

var grid;
var tempGrid;
var maxHeight;
var maxWidth;

var dotSize;

var canv;
var ctx;

var SURVIVES = [1,2,3,4,5];
var CREATES = [3];

var drawInterval;

var printTimeout;
var drawTimeout;

var lightFill = "#333";

var curColor = [r_in_r(10,240),r_in_r(10,240),r_in_r(10,240)];

var MAX_CHANGE = 10;

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
  console.log(SURVIVES);
  console.log(CREATES);
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
  //console.log("drawing");
  nextColor();
  for (var x = 0; x < grid.length; x++) {
    for (var y = 0; y < grid[x].length; y++) {
      if (grid[x][y][1] == 1) {
        if (grid[x][y][0] == 1) {
          ctx.fillStyle = colorToString();
          ctx.fillRect(x*2*dotSize,y*2*dotSize,dotSize*2,dotSize*2);
        }
        else if (grid[x][y][0] == 0) {
          ctx.fillStyle = "#000";
          ctx.fillRect(x*2*dotSize,y*2*dotSize,dotSize*2,dotSize*2);
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

  nextDraw();
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

/**
 * Resets the canvas. Called when the grid is clicked.
 */
function resetCanvas() {
  // HEY YOU SHOULD UNCOMMENT THIS IF YOU WANNA SEE SOMETHING COOL
  //randomLife();
  // ^^^ This line here ^^^
  colorBars();
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
  var canvCont = document.getElementsByClassName('four')[0];
  maxWidth = canvCont.clientWidth;
  maxHeight = canvCont.clientHeight;

  canv = document.createElement('canvas');
  canv.width = maxWidth*2;
  canv.height = maxHeight*2;

  canvCont.appendChild(canv);
  ctx = canv.getContext('2d');
  ctx.fillStyle = lightFill;

  dotSize = (maxWidth/1000);
  initGrid();

  canv.addEventListener('mousemove',canvMouseEventListener);
  canv.addEventListener('click',resetCanvas);
  console.log("You can draw on that black box over there by hoving your mouse over it. Click anywhere in the black box to reset the canvas. To randomize the pattern being drawn, just run this function: 'randomLife()'. Then just draw some more!");
  console.log();
  console.log();
  console.log();
}

/*******************************************************************************
***************************** Initialization ***********************************
*******************************************************************************/

/**
 * Checks if the browser is Safari or if the device is an apple device (I don't
 * have one to test with)
 * (Safari has some jank css stuff and I couldn't wait to email you guys.)
 * @return {Boolean} True if Safari; false otherwise
 */
function isSafari() {
  var nav = window.navigator,
  ua = window.navigator.userAgent.toLowerCase();
  var mobile = false;
  // detect browsers (only the ones that have some kind of quirk we need to work around)
  if (ua.match(/ipad/i) !== null)
    mobile = true;

  if (ua.match(/iphone/i) !== null)
    mobile = true;

  // console.log(mobile);
  return mobile || /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
}

/**
 * Shows a message (and nothing else) if using Safari.
 */
function showMessage() {
  while (document.body.hasChildNodes())
    document.body.removeChild(document.body.childNodes[0]);

  var messageCont = document.createElement('div');
  messageCont.style.display = "flex";
  messageCont.style.flexDirection = "column";
  messageCont.style.justifyContent = "center";
  messageCont.style.height = "100%";
  messageCont.style.width = "100%";
  document.body.appendChild(messageCont);

  var message = document.createElement('p');
  message.innerHTML = "Please use <a href='https://www.google.com/chrome/'>Chrome<a> on desktop or Android :)";

  messageCont.appendChild(message);
}

/**
 * Initializes the page.
 */
function init() {
  colorBars()
  if (isSafari()) {
    showMessage();
  }
  else {
    initVals();
    fixElements();
    setTimeout(function () {
      document.body.addEventListener('mousemove',mMoveHandler);
      if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', devOrientHandler, false);
      }
      updateElements();
      initCanv();
    }, 1500);
  }
}

window.onload = init;
