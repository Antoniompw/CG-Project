var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// Points to act as reference to where to draw
var points = [];
// Beings to render after
var objects = {"Line" : [], "Bezier" : [], "Circle" : [], "Polygon" : [], "None" : []};
// How thick
let mode = "None";

// Registers left mouse clicks
document.getElementById('canvas').addEventListener('click', mouseLeftClick, false);

// Clears canvas board
function clearBoard(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  mode = "None";
  points = [];
  objects = {"Line" : [], "Bezier" : [], "Circle" : [], "Polygon" : []};
}

// Registers what is draw at time
// Stacks at dict and resets current drawing points
function register(){
	if(points.length > 1){
		objects[mode].push(points);
	}
	console.log("Pushing "+mode);
	points = [];
	mode = "None";
}

// All the pollowing functions follow the same principle
// Register what has been already draw
// Change drawing mode
function modeBezier(){
	register();
	mode = "Bezier";
}

function modeLine(){
	register();
	mode = "Line";
}

function modeCircle(){
	register();
	mode = "Circle";
}

function modePolygon(){
	register();
	mode = "Polygon";
}


// Function that reads all registers
// Renders everything contained at the main dictionary
// After, renders what is currently being draw
function renderObjects(){
	// Flow through keys
	for(var key in objects){
		// If collection of lines
		if(key == "Line"){
			// Render line per line
			objects[key].forEach(line => {
				renderLine(line);
			});
		}
		// If collection of circles
		if(key == "Circle"){
			// Render circle per circle
			objects[key].forEach(circle => {
				renderCircle(circle);
			});
		}
		// If collection of Bezier's
		if(key == "Bezier"){
			// Render each Bezier curve
			objects[key].forEach(bezier => {
				renderBezier(bezier);
			});
		}
		if(key == "Polygon"){
			objects[key].forEach(polygon => {
				renderPolygon(polygon);
			});
		}
	}
	if(mode == "Line" && points.length){
		renderLine(points);
	}
	if(mode == "Polygon"){
		renderPolygon(points);
	}
	if(mode == "Bezier"){
		renderBezier(points);
	}
	if(mode == "Circle"){
		renderCircle(points);
	}

}

// Receives series of coordinates and renders a line
// Only if possible
function renderLine(line){
	if(line.length < 2){
		return;
	}
	x1 = line[0][0];
	y1 = line[0][1];
	x2 = line[1][0];
	y2 = line[1][1];
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
}

// Fine method to get distance between two points
function getRadius(x1, y1, x2, y2){
	var a = x1 - x2;
	var b = y1 - y2;
	var c = Math.sqrt( a*a + b*b );
	return c;
}

// Receives series of coordinates and renders a circle
// Only if possible
function renderCircle(circle){
	if(circle.length < 2){
		return;
	}
	x1 = circle[0][0];
	y1 = circle[0][1];
	x2 = circle[1][0];
	y2 = circle[1][1];
	radius = getRadius(x1, y1, x2, y2);
	ctx.beginPath();
	ctx.arc(x1, y1, radius, 0, 2 * Math.PI);
	ctx.stroke();
}

// Receives series of coordinates and renders a polygon
// Only if possible
function renderPolygon(polygon){
	if(polygon.length < 1){
		return;
	}
	ctx.beginPath();
	// First point
	a = polygon[0]
	// First coodinates
	x1 = a[0];
	y1 = a[1];
	ctx.moveTo(x1, y1);
	polygon.forEach(point => {
		x = point[0];
		y = point[1];
		ctx.lineTo(x, y);
	})
	ctx.closePath();
	ctx.stroke();
}

// Receives series of coordinates and renders a bezier curve
// Only if possible
function renderBezier(bezier){
	if(bezier.length != 4){
		return;
	}
	ctx.beginPath();
	// First point
	a = bezier[0];
	b = bezier[1];
	c = bezier[2];
	d = bezier[3];
	// First coodinates
	x1 = a[0];
	y1 = a[1];
	x2 = b[0];
	y2 = b[1];
	x3 = c[0];
	y3 = c[1];
	x4 = d[0];
	y4 = d[1];
	ctx.moveTo(x1, y1);
	ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3, x4, y4);
	ctx.stroke();
}












// If following mouse
let fixed = true;

// Every time someone clicks the canvas
function mouseLeftClick(event){
	// If there is a draw mode, stack the points
	if(mode != "None"){
		var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
		points.push([x,y]);
		console.log("X:"+x+", Y:"+y+", Mode:"+mode);
		return;
	}
}

// Clears canvas and renders it's objects over again
setInterval(function(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	renderObjects();
}, 30);