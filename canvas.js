var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

// Points to act as reference to where to draw
var points = [];
// How thick
let line_width = 2;


// Clears canvas board
function clear(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  points = [];
}