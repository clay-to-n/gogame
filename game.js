var canvas;
var context;

function initialize() {
  canvas = document.getElementById('myCanvas');
  context = canvas.getContext('2d');
  canvas.addEventListener("mousedown" , mouseClicked, false);

  // Draw the board
  context.lineWidth = 1;
  context.strokeStyle = '#bbb';
  for (m=0; m<19; m++) {
    // Draw vertical grid
    context.beginPath();
    context.moveTo(m*20, 0);
    context.lineTo(m*20, 320);
    context.stroke();

    // Draw horizontal grid
    context.beginPath();
    context.moveTo(0, m*20);
    context.lineTo(320, m*20);
    context.stroke();
  }
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: (evt.clientX-rect.left)/(rect.right-rect.left)*canvas.width,
    y: (evt.clientY-rect.top)/(rect.bottom-rect.top)*canvas.height
  };
}

// When clicked, place piece
function mouseClicked(event) {
  var pos = getMousePos(canvas, event);
  context.fillStyle = "#000000";
  context.fillRect(pos.x, pos.y, 4, 4);
}