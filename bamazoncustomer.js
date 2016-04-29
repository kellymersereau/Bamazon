var mysql = require('mysql');
var prompt = require('prompt');
var colors = require('colors/safe');
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'Bamazon'
});

var productPurchasedId = 0;
var productPurchasedQuantity = 0;

connection.connect();

connection.query('SELECT ItemID, ProductName, Price FROM Products', function(err, result){
	if (err) throw err;
	for(var i = 0; i < result.length; i++){
		console.log("Item ID#: " + result[i].ItemID);
		console.log("Product Name: " + result[i].ProductName);
		console.log("Price: " + result[i].Price);
		console.log(" ");
	}
});

prompt.start();

connection.end();