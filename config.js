var DB_config = {
	host: 'localhost',
	user: 'root',
	password:'',
	database: 'EDISS'
};

var session_config = {
	secret: 'ssshhhhh', 
	cookie: {maxAge: 15 * 60000},
	saveUninitialized: true, 
	resave: true
};

module.exports.DB_config = DB_config;
module.exports.session_config = session_config;