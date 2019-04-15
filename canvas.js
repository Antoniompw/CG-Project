var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// Points to act as reference to where to draw
var points = [];
// Beings to render after
var objects = {"Line" : [], "Bezier" : [], "Circle" : [], "Polygon" : [], "None" : []};
// Initial mode
let mode = "None";

var mouse_x = 0;
var mouse_y = 0;

// Registers left mouse clicks and execute function mouseLeftClick
document.getElementById('canvas').addEventListener('click', mouseLeftClick, false);


// Updates mouse position every time mouse moves over canvas
function mousePosition(event){
	var rect = canvas.getBoundingClientRect();
    mouse_x = event.clientX - rect.left;
    mouse_y = event.clientY - rect.top;
}

// Clears canvas board
function clearBoard(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  mode = "None";
  points = [];
  objects = {"Line" : [], "Bezier" : [], "Circle" : [], "Polygon" : []};
}

// Registers what is draw at time
// HOW => Stacks at dict and resets current drawing points
function register(){
	// If there are points to be stacked, stack
	if(points.length > 1){
		objects[mode].push(points);
	}
	// Notifies the user that something is being registered
	console.log("Pushing "+mode);
	// Trow out points
	points = [];
	// Become neutral
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
function modePick(){
	register();
	mode = "Pick";
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
		// If collection of Polygon's
		if(key == "Polygon"){
			// Render each Polygon
			objects[key].forEach(polygon => {
				renderPolygon(polygon);
			});
		}
	}

}

// Receives series of coordinates and renders a line
// Only if possible
function renderLine(line){
	console.log()
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
	if(bezier.length == 4){
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
		ctx.bezierCurveTo(x2, y2, x3, y3, x4, y4);
		ctx.stroke();
	}
	else if(bezier.length == 3){
		// First point
		a = bezier[0];
		b = bezier[1];
		c = bezier[2];
		// First coodinates
		x1 = a[0];
		y1 = a[1];
		x2 = b[0];
		y2 = b[1];
		x3 = c[0];
		y3 = c[1];
		ctx.moveTo(x1, y1);
		// Repeats control point two times
		ctx.bezierCurveTo(x2, y2, x2, y2, x3, y3);
		ctx.stroke();
	}
	else if(bezier.length == 2){
		// First point
		a = bezier[0];
		b = bezier[1];
		// Start point
		x1 = a[0];
		y1 = a[1];
		// End point
		x3 = b[0];
		y3 = b[1];
		// Control point
		x2 = (x1+x3)/2;
		y2 = (y1+y3)/2;
		ctx.moveTo(x1, y1);
		// Repeats control point two times
		ctx.bezierCurveTo(x2, y2, x2, y2, x3, y3);
		ctx.stroke();
	}
}

/*
BY THIS LINE AND FORTH ALL THE LOGIC
IS MEANT TO HANDLE CLICKS AND SELECT
ION OF POINTS
*/
// Auxiliary flag
// Activated if point is meant to follow mouse
let fixed = true;

// Every time someone clicks the canvas
function mouseLeftClick(event){
	// Gets mouse position
	var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

	// If there is a draw mode, stack the points
	if(mode == "Line" || mode == "Polygon" || mode == "Bezier" || mode == "Circle"){
		points.push([x,y]);
		console.log("X:"+x+", Y:"+y+", Mode:"+mode);
	}

	// If it is in pick mode
	if(mode == "Pick"){
		pick();
	}

	// If it is in rotate mode
	if(mode == "Rotate"){
		pickAndRotate();
	}

	//if it is in scale mode
	if(mode == "Scale"){
		pickAndScale();
	}

	if(mode == "Translate"){
		pickAndTranslate();
	}

	if(mode == "Mirror"){
		pickAndMirror();
	}

	// If line intersects, do not allow to form polygon
	if(mode == "Polygon"){
		if(points.length > 3){
			for(i = 0; i<points.length - 2; i++){
				console.log("i "+i);
				if(intersect(points[points.length - 2],points[points.length-1], points[i], points[i+1]) == true){
					points.pop();
				}
			}
		}
	}

	// As a line only uses two points, register
	if(mode == "Line" && points.length == 2){
		register();
	}
	// As a circle only uses two points, register
	if(mode == "Circle" && points.length == 2){
		register();
	}
	// As a Bezier curve can only be draw until 4 points, register
	if(mode == "Bezier" && points.length == 4){
		register();
	}
}
// Based on https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
function intersect(a, b, c, d) {
  x1 = a[0];
  y1 = a[1];
  x2 = b[0];
  y2 = b[1];
  x3 = c[0];
  y3 = c[1];
  x4 = d[0];
  y4 = d[1];
  var det, gamma, lambda;
  det = (x2 - x1) * (y4 - y3) - (x4 - x3) * (y2 - y1);
  if (det === 0) {
    return false;
  } else {
    lambda = ((y4 - y3) * (x4 - x1) + (x3 - x4) * (y4 - y1)) / det;
    gamma = ((y1 - y2) * (x4 - x1) + (x2 - x1) * (y4 - y1)) / det;
    result = (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
  	return result;
  }
}

// Clears canvas and renders it's objects over again
setInterval(function(event){
	// Clears canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	points.push([mouse_x, mouse_y]);
	// Renders real time line
	if(mode == "Line"){
		renderLine(points);
	}
	// Renders real time circle
	else if(mode == "Circle"){
		renderCircle(points);
	}
	// Renders real time Polygon
	else if(mode == "Polygon"){
		renderPolygon(points)
	}
	// Renders real time Bezier curve
	else if(mode == "Bezier"){
		renderBezier(points);
	}
	points.pop();

	// Renders pushed objects
	renderObjects();
}, 30);


/*
PICK ALGORITHMS
*/
function pick(){
	// Flow through keys
	for(var key in objects){
		// If collection of lines
		if(key == "Line"){
			// Pick line per line
			objects[key].forEach(line => {
				pickLine(line);
			});
		}
		// If collection of circles
		if(key == "Circle"){
			// Pick circle per circle
			objects[key].forEach(circle => {
				pickCircle(circle);
			});
		}
		// If collection of Polygon's
		if(key == "Polygon"){
			// Pick each Polygon
			objects[key].forEach(polygon => {
				pickPolygon(polygon);
			});
		}
	}
}

// Código de pick line ruim
function pickLine(line){
	tol = 10;
	x1 = line[0][0];
	y1 = line[0][1];
	x2 = line[1][0];
	y2 = line[1][1];
	distance = getRadius(x1, y1, x2, y2);
	x_unitario = (x2-x1)/distance;
	y_unitario = (y2-y1)/distance;
	for(i=0; i<distance; i++){
		if(Math.abs(mouse_x - (x_unitario*i+x1)) < tol){
			if(Math.abs(mouse_y - (y_unitario*i+y1)) < tol){
				console.log("Line Picked");
				return 1;
				break;
			}
		}
	}
	return 0;
}
// Código razoável de pick circle
function pickCircle(circle){
	x1 = circle[0][0];
	y1 = circle[0][1];
	x2 = circle[1][0];
	y2 = circle[1][1];
	radius = getRadius(x1, y1, x2, y2);
	radius2 = getRadius(x1, y2, mouse_x, mouse_y);
	if(radius > radius2){
		console.log("Circle Picked");
		return 1;
	}
	return 0;
}

// Ray-casting algorithm
// Referencia: http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
function pickPolygon(polygon) {
    x = mouse_x;
    y = mouse_y;

    inside = 0;

    for (i = 0; i < polygon.length; i++) {
        xi = polygon[i%polygon.length][0];
        yi = polygon[i%polygon.length][1];
        xj = polygon[(i+1)%polygon.length][0];
        yj = polygon[(i+1)%polygon.length][1];
        if(((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)){
        	inside++;
    	}
    }
    // Se o número de intersecções for impar, está dentro
    if(inside%2 == 1){
    	console.log("Polygon picked");
    	angulos_internos_e_area(polygon);
    	return 1;
    }
    return 0;
}



function find_angle(x, y, x1, y1, x2, y2) {
    var AB = Math.sqrt(Math.pow(x-x1 ,2) + Math.pow(y-y1 ,2));
    var BC = Math.sqrt(Math.pow(x-x2 ,2) + Math.pow(y-y2 ,2));
    var AC = Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2));
    return Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB));
}

function triangle_area(x, y, x1, y1, x2, y2){
	return Math.abs(((x*y1)+(y*x2)+(x1*y2)-(x2*y1)-(y*x1)-(x*y2))/2);
}
function rad_to_degree(rad){
	return rad/Math.PI * 180;
}
function degree_to_rad(degrees) {
	return degrees * Math.PI / 180;
}
function angulos_internos_e_area(polygon){
	area = 0
	angles = []
	for(i = 0; i < polygon.length; i++){
		xi = polygon[i%polygon.length][0];
		yi = polygon[i%polygon.length][1];
		xj = polygon[(i+1)%polygon.length][0];
		yj = polygon[(i+1)%polygon.length][1];
		xk = polygon[(i+2)%polygon.length][0];
		yk = polygon[(i+2)%polygon.length][1];
		angles.push(find_angle(xj, yj, xi, yi, xk, yk));
		area += triangle_area(mouse_x, mouse_y, xi, yi, xj, yj);
		console.log("Angle "+i+", "+rad_to_degree(angles[i]));
	}
	console.log("Area: "+area);
}



// Geometric transformations
function rotateMode(){
	register();
	mode = "Rotate";
}

function translateMode(){
	register();
	mode = "Translate";
}

function scaleMode(){
	register();
	mode = "Scale";
}

function mirrorMode(){
	register();
	mode = "Mirror";
}

function pickAndRotate(){
	// Flow through keys
	for(var key in objects){
		// If collection of lines
		if(key == "Line"){
			// Pick line per line
			objects[key].forEach(line => {
				// If it is picked, rotate
				if(pickLine(line)){
					rotate(line)
				}
			});
		}
		// If collection of Polygon's
		if(key == "Polygon"){
			// Pick each Polygon
			objects[key].forEach(polygon => {
				// If it is picked, rotate
				if(pickPolygon(polygon)){
					rotate(polygon);
				}
			});
		}
	}
}

function rotate(points){
	reference_x = points[0][0];
	reference_y = points[0][1];
	// Make polygon go to (0,0)
	points.forEach(point => {
		point[0] = point[0] - reference_x;
		point[1] = point[1] - reference_y;
	});

	theta = document.getElementById("theta").value;
	theta = degree_to_rad(theta);

	// TRANSFORM
	points.forEach(point =>{
		x = point[0];
		y = point[1];
		point[0] = x*Math.cos(theta) - y*Math.sin(theta);
		point[1] = x*Math.sin(theta) + y*Math.cos(theta);
	});

	// Translate back to reference
	points.forEach(point => {
		point[0] = point[0] + reference_x;
		point[1] = point[1] + reference_y;
	});
}

function pickAndScale(){
	// Flow through keys
	for(var key in objects){
		// If collection of lines
		if(key == "Line"){
			// Pick line per line
			objects[key].forEach(line => {
				// If it is picked, rotate
				if(pickLine(line)){
					scale(line)
				}
			});
		}
		// If collection of Polygon's
		if(key == "Polygon"){
			// Pick each Polygon
			objects[key].forEach(polygon => {
				// If it is picked, rotate
				if(pickPolygon(polygon)){
					scale(polygon);
				}
			});
		}
	}
}

function scale(points){
	reference_x = points[0][0];
	reference_y = points[0][1];
	// Make polygon go to (0,0)
	points.forEach(point => {
		point[0] = point[0] - reference_x;
		point[1] = point[1] - reference_y;
	});

	x_scale = document.getElementById("x-factor").value;
	y_scale = document.getElementById("y-factor").value;
	// TRANSFORM
	points.forEach(point =>{
		x = point[0];
		y = point[1];
		point[0] = x*x_scale;
		point[1] = y*y_scale;
	});

	// Translate back to reference
	points.forEach(point => {
		point[0] = point[0] + reference_x;
		point[1] = point[1] + reference_y;
	});
}


function pickAndTranslate(){
	// Flow through keys
	for(var key in objects){
		// If collection of lines
		if(key == "Line"){
			// Pick line per line
			objects[key].forEach(line => {
				// If it is picked, rotate
				if(pickLine(line)){
					translate(line);
				}
			});
		}
		// If collection of Polygon's
		if(key == "Polygon"){
			// Pick each Polygon
			objects[key].forEach(polygon => {
				// If it is picked, rotate
				if(pickPolygon(polygon)){
					translate(polygon);
				}
			});
		}
	}
}

function translate(points){
	x_offset = document.getElementById("x_offset").value;
	y_offset = document.getElementById("y_offset").value;
	console.log("Offset: ");
	console.log(x_offset+", "+y_offset);
	// TRANSFORM
	points.forEach(point =>{
		console.log("Old point");
		console.log(point[0]+", "+point[1]);
		point[0] += parseFloat(x_offset);
		point[1] += parseFloat(y_offset);
		console.log("New point:");
		console.log(point[0]+", "+point[1]);
	});
}

function pickAndMirror(){
	// Flow through keys
	for(var key in objects){
		// If collection of lines
		if(key == "Line"){
			// Pick line per line
			objects[key].forEach(line => {
				// If it is picked, rotate
				if(pickLine(line)){
					mirror(line);
				}
			});
		}
		// If collection of Polygon's
		if(key == "Polygon"){
			// Pick each Polygon
			objects[key].forEach(polygon => {
				// If it is picked, rotate
				if(pickPolygon(polygon)){
					mirror(polygon);
				}
			});
		}
	}
}

function mirror(points){
	reference_x = points[0][0];
	reference_y = points[0][1];
	// Make polygon go to (0,0)
	points.forEach(point => {
		point[0] = point[0] - reference_x;
		point[1] = point[1] - reference_y;
	});

	value = document.getElementById("axis").value;
	if(value === "x"){
		// TRANSFORM
		points.forEach(point =>{
			point[0] = -point[0];
		});

	} else if(value === "y"){
		points.forEach(point =>{
			point[1] = -point[1];
		});
	}
	// Translate back to reference
	points.forEach(point => {
		point[0] = point[0] + reference_x;
		point[1] = point[1] + reference_y;
	});
}