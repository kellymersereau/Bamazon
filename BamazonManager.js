var mysql = require('mysql');
var prompt = require('prompt');
var colors = require('colors/safe');
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'Bamazon', 
});

var inventoryUpdate = [];
var addedProduct = [];

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
	var addInvt = {
		properties:{
			inventoryID: {
				description: colors.blue('What is the ID number of the product you want to add inventory for?')
			},
			inventoryAmount:{
				description: colors.green('How many items do you want to add to the inventory?')
			}
		},
	};

	prompt.start();


	prompt.get(addInvt, function(err, res){

		var invtAdded = {
			inventoryAmount: res.inventoryAmount,
			inventoryID: res.inventoryID,
		}

		inventoryUpdate.push(invtAdded);

		connection.query("UPDATE Products SET StockQuantity = (StockQuantity + ?) WHERE ItemID = ?;", [inventoryUpdate[0].inventoryAmount, inventoryUpdate[0].inventoryID], function(err, result){
			if(err) console.log('error '+ err);

			connection.query("SELECT * FROM Products WHERE ItemID = ?", inventoryUpdate[0].inventoryID, function(error, resOne){
				console.log('The new updated stock quantity for id# '+inventoryUpdate[0].inventoryID+ ' is ' + resOne[0].StockQuantity);
				connection.end();
			})

		})
	})
};

var addNewProduct = function(){
	var newProduct = {
		properties: {
			newIdNum:{ description: colors.green('Please enter a unique 5 digit item Id #')},
			newItemName:{ description: colors.blue('Please enter the name of the product you wish to add')},
			newItemDepartment: { description: colors.blue('What department does this item belong in?')},
			newItemPrice: { description: colors.green('Please enter the price of the item in the format of 00.00')},
			newStockQuantity: { description: colors.green('Please enter a stock quantity for this item')},
		}
	}

	prompt.start();
	prompt.get(newProduct, function(err, res){

		var newItem = {
			newIdNum: res.newIdNum,
			newItemName: res. newItemName,
			newItemDepartment: res.newItemDepartment,
			newItemPrice: res.newItemPrice,
			newStockQuantity: res.newStockQuantity,

		};

		addedProduct.push(newItem);

		connection.query('INSERT INTO Products (ItemID, ProductName, DepartmentName, Price, StockQuantity) VALUES (?, ?, ?, ?, ?);', [addedProduct[0].newIdNum, addedProduct[0].newItemName, addedProduct[0].newItemDepartment, addedProduct[0].newItemPrice, addedProduct[0].newStockQuantity], function(err, result){

			if(err) console.log('Error: ' + err);

			console.log('New item successfully added to the inventory!');
			console.log(' ');
			console.log('Item id#: ' + addedProduct[0].newIdNum);
			console.log('Item name: ' + addedProduct[0].newItemName);
			console.log('Department: ' + addedProduct[0].newItemDepartment);
			console.log('Price: $' + addedProduct[0].newItemPrice);
			console.log('Stock Quantity: ' + addedProduct[0].newStockQuantity);

			connection.end();
		})
	})
};
