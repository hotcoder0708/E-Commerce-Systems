var http = require('http');
var fs = require('fs');

function serveStatic(res, path, contentType, responseCode) {
	if (!responseCode) {
		responseCode = 200;
	}
	fs.readFile(__dirname + path, function(err, data) {
		if (err) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end('Internal Error');
		} else {
			res.writeHead(responseCode, {'Content-Type': contentType});
			res.end(data);
		}
	});
}

http.createServer(function(req, res) {
	var path = req.url;
	//res.writeHead(200, {'Content-Type': 'text/plain'});
	if (path == '/') {
		serveStatic(res, '/public/index.html', 'text/html');
	} else if (path == '/about') {
		serveStatic(res, '/public/about.html', 'text/html');
	} else {
		serveStatic(res, '/public/notFound.html', 'text/html');
	}
}).listen(3000);

console.log('Press Ctrl + C to terminate');