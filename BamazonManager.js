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

// * List a set of menu options: 1) View Products for Sale 2) View Low Inventory 3) Add to Inventory 4) Add New Product

var managerOptions = {
	properties:{
		mOptions:{
			description: colors.blue('Key in one of the following options: 1) View Products for Sale 2) View Low Inventory 3) Add to Inventory 4) Add New Product')
		},
	},
};

prompt.start();
prompt.get(managerOptions, function(err, res){
	if(res.mOptions == 1){
		viewProducts();
	} else if(res.mOptions == 2){
		viewInventory();
	} else if(res.mOptions == 3){
		addInventory();
	} else if(res.mOptions ==4){
		addNewProduct();
	} else {
		console.log('You picked an invalid choice.');
		connection.end();
	}
});

var viewProducts = function(){
	connection.query('SELECT * FROM Products', function(err, res){
		console.log('');
		console.log('Products for Sale')
		console.log('');	

		for(var i=0; i<res.length; i++){
			console.log('Item Id #: ' + res[i].ItemID);
			console.log('Product Name: ' + res[i].ProductName);
			console.log('Department Name: ' + res[i].DepartmentName);
			console.log('Price: $' + res[i].Price);
			console.log('Stock Quantity: ' + res[i].StockQuantity);
			console.log('');	
		};
		connection.end();
	})
};

var viewInventory = function(){
	connection.query('SELECT * FROM Products WHERE StockQuantity < 5', function(err, res){
		console.log('');
		console.log('Items With Low Inventory');
		console.log('');

		for(var i=0; i<res.length; i++){
			console.log('Item Id #: ' + res[i].ItemID);
			console.log('Product Name: ' + res[i].ProductName);
			console.log('Department Name: ' + res[i].DepartmentName);
			console.log('Price: $' + res[i].Price);
			console.log('Stock Quantity: ' + res[i].StockQuantity);
			console.log('');	
		};
		connection.end();
	})
};

var addInventory = function(){

};

var addNewProduct = function(){

};
