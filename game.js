var GRID = 16; // Play on a GRID x GRID grid
var SPACE = 20; // Pixels between each rule. Should be even
var canvas;
var context;
var turnColor = false;
var pieces;

function initialize() {
  canvas = document.getElementById('boardCanvas');
  context = canvas.getContext('2d');
  canvas.addEventListener("mousedown" , mouseClicked, false);

  // Initialize an array to keep track of board state
  pieces = new Array(GRID);
  for (i = 0; i <= GRID; i++) {
    pieces[i] = [];
  }
  
  // Draw the board
  context.lineWidth = 1;
  context.strokeStyle = '#BBB';
  for (m = 0; m < GRID + 1; m++) {
    // Draw vertical grid
    context.beginPath();
    context.moveTo(m*SPACE, 0);
    context.lineTo(m*SPACE, 320);
    context.stroke();

    // Draw horizontal grid
    context.beginPath();
    context.moveTo(0, m*SPACE);
    context.lineTo(320, m*SPACE);
    context.stroke();
  }
}

// Called by mouseClicked
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: (evt.clientX-rect.left)/(rect.right-rect.left)*canvas.width,
    y: (evt.clientY-rect.top)/(rect.bottom-rect.top)*canvas.height
  };
}

// Snaps an x or y coordinate to the grid
function snap(z) {
  off = z % SPACE;
  if (off > SPACE / 2)
    z = z +(SPACE - off);
  else
    z = z - off;
  return z;
}

// When clicked, place piece
function mouseClicked(event) {
  
  var pos = getMousePos(canvas, event);
  // These are the actual x, y pixels to draw to
  var x = snap(pos.x);
  var y = snap(pos.y);
  // These are the "board" coordinates
  var playX = x / SPACE;
  var playY = y / SPACE;
  
  // If there's a piece there, we don't place a piece
  if (pieces[playX][playY] != null) {
    // The == and != operator consider null equal to only null or undefined
    return;
  }
  
  // Draw the piece
  if (turnColor) {
    context.fillStyle = "#000";
    context.beginPath();
    context.arc(x, y, 4, 0, 2 * Math.PI, false);
    context.fill();
  } else {
    context.fillStyle = "#FFF";
    context.beginPath();
    context.arc(x, y, 4, 0, 2 * Math.PI, false);
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = '#BBB';
    context.stroke();
  }
 
  // Keep track of the piece there
  var piece = {
    color: turnColor,
    x: playX,
    y: playY
  }
  pieces[playX][playY] = piece;
  
  checkCapture(piece);
  
  console.log(playX+", "+playY+" "+(turnColor ? "Black" : "White"));
  
  // Switch turns
  turnColor = !turnColor;
  
}

function checkCapture(capturingPiece) {
  var neighbors = getNeighbors(capturingPiece);
  
  for (k = 0; k < neighbors.length; k++) {

    var killList = [];
    
    flood(killList, neighbors[k], capturingPiece.color);
    
    if (checkKill(killList) === true) {    
      clearPieces(killList); 
    }
  }
}

// Fills the killList with every same-color piece
function flood(killList, piece, killingColor) {
  if (piece.color !== killingColor) {
    if (_.findWhere(killList, piece) == null) {
      killList.push(piece);
    }
    // For the piece I might be killing, get all of its neighbors
    var neighbors = getNeighbors(piece);
    for (i = 0; i < neighbors.length; i++) {
      if ((neighbors[i].color !== killingColor)&&(_.findWhere(killList, neighbors[i]) == null)) {
        flood(killList, neighbors[i], killingColor);
      }
    }
  }
}

function checkKill(killList) {
  if (killList.length === 0) {
    return false;
  }
  for (i = 0; i < killList.length; i++) {
    if (hasLiberty(killList[i]))
      return false;
  }
  return true;
}

// Clears the pieces off of the board
function clearPieces(killList) {
  console.log("We killed and are clearing pieces");
  for (i = 0; i < killList.length; i++) {
    var x = killList[i].x;
    var y = killList[i].y;
    
    pieces[x][y] = null;
    context.fillStyle = "#FFF";
    context.beginPath();
    context.arc(x*SPACE, y*SPACE, 5, 0, 2 * Math.PI, false);
    context.fill();
  }
}

function getNeighbors(piece) {
  var neighbors = [];
  var x = piece.x;
  var y = piece.y;
  if (x + 1 < GRID) {
    if (pieces[x+1][y] != null) {
      neighbors.push(pieces[x+1][y]);
    }
  }
  if (x - 1 >= 0) {
    if (pieces[x-1][y] != null) {
      neighbors.push(pieces[x-1][y]);
    }
  }
  if (y + 1 < GRID) {
    if (pieces[x][y+1] != null) {
      neighbors.push(pieces[x][y+1]);
    }
  }
  if (y - 1 >= 0) {
    if (pieces[x][y-1] != null) {
      neighbors.push(pieces[x][y-1]);
    }
  }
  return neighbors;
}

function hasLiberty(piece) {
  var x = piece.x;
  var y = piece.y;
  if (x + 1 < GRID) {
    if (pieces[x+1][y] == null) {
      return true;
    }
  }
  if (x - 1 >= 0) {
    if (pieces[x-1][y] == null) {
      return true;
    }
  }
  if (y + 1 < GRID) {
    if (pieces[x][y+1] == null) {
      return true;
    }
  }
  if (y - 1 >= 0) {
    if (pieces[x][y-1] == null) {
      return true;
    }
  }
  return false;
}