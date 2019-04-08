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

// All the pollowing functions follow the same principle
// Change the draw mode
function modeBezier(){
	if(points.length > 1){
		objects[mode].push(points);
	}
	mode = "Bezier";
	points = [];
}

function modeLine(){
	if(points.length > 1){
		objects[mode].push(points);
	}
	mode = "Line";
	points = [];
}

function modeCircle(){
	if(points.length > 1){
		objects[mode].push(points);
	}
	mode = "Circle";
	points = [];
}

function modePolygon(){
	if(points.length > 1){
		objects[mode].push(points);
	}
	mode = "Polygon";
	points = [];
}

function register(){
	if(points.length > 1){
		objects[mode].push(points);
	}
	console.log("Pushing"+mode);
	points = [];
	mode = "None";
	renderObjects();
}

function mouseLeftClick(event){
	// If there is a draw mode, stack the points
	if(mode != "None"){
		var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
		points.push([x,y]);
		console.log("X:"+x+", Y:"+y+", Mode:"+mode);
	}
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	renderObjects();
}

// Function that reads all registers
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
}

function renderLine(line){
	if(line.length < 1){
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

function getRadius(x1, y1, x2, y2){
	var a = x1 - x2;
	var b = y1 - y2;
	var c = Math.sqrt( a*a + b*b );
	return c;
}

function renderCircle(circle){
	if(circle.length < 1){
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

function renderPolygon(polygon){
	if(polygon.length < 1){
		return;
	}
}
function renderBezier(bezier){
	if(bezier.length < 1){
		return;
	}
}