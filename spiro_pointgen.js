const XMLWriter = require('xml-writer'); 
const fs = require('fs'); 

function getSpirographCoordinates() {
	// Bovard Coordinates
	var origin = {
		lat: 34.021038, 
		lng: -118.285577

	};

	// An array to hold the coordinates of the spirograph
	var paths = []; 
	var R = 5;
	var r = 1;
	var a = 4; 
	var x0 = R + r - a; 
	var y0 = 0; 

	var cos = Math.cos; 
	var sin = Math.sin; 
	var pi = Math.PI;
	var nRev = 16; 

	// Parameter to scale the spirograph
	var spiroScale = 0.0001; 

	// Generate coordinates
	for (var t = 0.0; t < (pi * nRev); t += 0.01) {
		var x = (R + r) * cos((r / R) * t) - a * cos((1 + r / R) * t); 
		var y = (R + r) * sin((r / R) * t) - a * sin((1 + r / R) * t); 

		// Spirograph scaling
		x *= spiroScale; 
		y *= spiroScale; 
		console.log(origin.lng + y);
		console.log(origin.lat + x);

		paths.push({
			lat: origin.lat + x, 
			lng: origin.lng + y
		});
	}

	return paths; 
}

var paths = getSpirographCoordinates(); 

console.log(paths);


var ws = fs.createWriteStream('./spiro.kml'); 

var xw  = new XMLWriter(false, function(string, encoding) {
	ws.write(string, encoding); 
}); 

xw.startDocument('1.0', 'UTF-8')
	.startElement('kml')
	.writeAttribute('xmlns', 'http://earth.google.com/kml/2.0')
	.startElement('Document')
	.startElement('coordinates')

paths.forEach(function(path) {
	xw.text(path.lng + ','  + path.lat+ '\n');
});

xw.endElement().endElement().endElement().endDocument(); 

ws.end();  