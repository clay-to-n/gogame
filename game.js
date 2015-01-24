var GRID = 20; // Pixels between each rule. Should be even
var canvas;
var context;

function initialize() {
  canvas = document.getElementById('myCanvas');
  context = canvas.getContext('2d');
  canvas.addEventListener("mousedown" , mouseClicked, false);

  // Initialize an array to keep track of board state
  var p = new Object();
  p.x = 0;
  p.y = 0;
  
  
  // Draw the board
  context.lineWidth = 1;
  context.strokeStyle = '#bbb';
  for (m=0; m<19; m++) {
    // Draw vertical grid
    context.beginPath();
    context.moveTo(m*GRID, 0);
    context.lineTo(m*GRID, 320);
    context.stroke();

    // Draw horizontal grid
    context.beginPath();
    context.moveTo(0, m*GRID);
    context.lineTo(320, m*GRID);
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
  off = z % GRID;
  if (off > GRID / 2)
    z = z +(GRID - off);
  else
    z = z - off;
  return z;
}

// When clicked, place piece
function mouseClicked(event) {
  var pos = getMousePos(canvas, event);
  context.fillStyle = "#000000";
  context.beginPath();
  context.arc(snap(pos.x), snap(pos.y), 4, 0, 2 * Math.PI, false);
  context.fill();
}