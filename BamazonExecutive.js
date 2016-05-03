var mysql = require('mysql');
var prompt = require('prompt');
var colors = require('colors/safe');
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'Bamazon', 
});

connection.connect();

var executiveOptions = {
	properties:{
		eOptions:{
			description: colors.red('Key in one of the following options: 1) View Product Sales by Department 2) Create New Department')
		},
	},
};