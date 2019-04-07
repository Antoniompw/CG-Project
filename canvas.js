var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

// Points to act as reference to where to draw
var points = [];
// How thick
let line_width = 2;
let mode = "None";

// Registers left mouse clicks
document.getElementById('canvas').addEventListener('click', mouseLeftClick, false);


// Clears canvas board
function clearBoard(){
  context.clearRect(0, 0, canvas.width, canvas.height);
  mode = "None";
  points = [];
}

// All the pollowing functions follow the same principle
// Change the draw mode
function modeBezier(){
	mode = "Bezier";
	points = [];
}

function modeLine(){
	mode = "Line";
	points = [];
}

function modeCircle(){
	mode = "Circle";
	points = [];
}

function modePolygon(){
	mode = "Polygon";
	points = [];
}

function mouseLeftClick(event){
	// If there is a draw mode, stack the points
	if(mode != "None"){
		var x = event.clientX;
		var y = event.clientY;
		points.push([x,y]);
		console.log("X:"+x+", Y:"+y+", Mode:"+mode);
	}
}