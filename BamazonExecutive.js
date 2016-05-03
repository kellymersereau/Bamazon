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

// * When an executive enters the View Product Sales option, they should given a summarized table which shows a format like the below:

prompt.start();
prompt.get(executiveOptions, function(err, res){
	if(res.eOptions == 1){
		viewProductSales();
	} else if(res.eOptions == 2){
		createDepartment();
	} else{
		console.log('You picked an invalid choice!');
		connection.end();
	}
});

var viewProductSales = function(){

};

var createDepartment = function(){

};