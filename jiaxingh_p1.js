// import required file
var express = require('express');
var util = require('util');
var mysql = require('mysql');
var session = require('express-session');
var bodyParser = require('body-parser');

// do the configuration
var app = express(); // using express

var connection = mysql.createConnection(require('./config.js').DB_config); // build mySQL connection
connection.connect(function(err) { // connect 
	if (err) {
		console.log(err);
	} else {
		console.log('DB EDISS connected');
	}
});

app.use(session(require('./config.js').session_config)); // use the session

app.use(bodyParser()); // use the middle ware

var sess; // global variable as session

// start GET & POST method
app.get('/', function(req, res) {
	connection.query('SELECT * FROM USER', function(err, rows, fields) {
		if (err) {
			console.log(err);
		} else {
			res.end(rows.toString());
		}
	});
});

app.post('/login', function(req, res) {
	sess = req.session;
	
	connection.query('SELECT * FROM USER WHERE username = ? AND pwd = PASSWORD(?)', [req.body.username, req.body.password], function(err, rows, fields) {
		console.log(util.inspect(rows));
		if (err) {
			console.log(err);
		} else {
			if (rows[0]) {
				sess.username = req.body.username;
				sess.password = req.body.password;
				var firstName;
				connection.query('SELECT FIRSTNAME FROM USER WHERE USERNAME = ?', [req.body.username], function(err, rows, fields) {
					firstName = rows[0]['FIRSTNAME'];
					res.end('Welcome ' + firstName);
				});
			} else {
				session.destroy();
				res.end('There seems to be an issue with the username/password combination that you entered');
			}
		}
	});
});

app.post('/logout', function(req,res) {
	sess = req.session;
	if (!sess.username) {
		res.end('You are not currently logged in');
	}
	sess.destroy(function(err) {
		if (err) {
			console.log(err);
		} else {
			res.end('You have been successfully logged out');
		}
	});
});

app.post('/add', function(req, res) {
	sess = req.session;
	if (!sess.username) {
		res.end('You must be logged in to access this function');
	} else {
		var num1 = parseInt(req.body.num1);
		var num2 = parseInt(req.body.num2);
		if (isNaN(num1) || isNaN(num2)) {
			res.end('The numbers you entered are not valid');
		} else {
			var answer = num1 + num2;
			res.end(answer.toString());
		}
	}
	
});

app.post('/divide', function(req, res) {
	sess = req.session;
	if (!sess.username) {
		res.end('You are not currently logged in');
	} else {
		var num1 = parseInt(req.body.num1);
		var num2 = parseInt(req.body.num2);
		if (num2 == 0 || isNaN(num1) || isNaN(num2)) {
			res.end('The numbers you entered are not valid');
		} else {
			var answer = parseInt(num1 / num2);
			res.end(answer.toString());
		}
	}
});

app.post('/multiply', function(req, res) {
	sess = req.session;
	if (!sess.username) {
		res.end('You are not currently logged in');
	} else {
		var num1 = Number(req.body.num1);
		var num2 = Number(req.body.num2);
		if (isNaN(num1) || isNaN(num2)) {
			res.end('The numbers you entered are not valid');
		} else {
			var answer = num1 * num2;
			res.end(answer.toString());
		}
	}	
});

app.listen(3000, function() {
	console.log("Port is 300, Press Ctrl + C to terminate");
});







