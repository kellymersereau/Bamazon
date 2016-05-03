var mysql = require('mysql');
var prompt = require('prompt');
var colors = require('colors/safe');
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'Bamazon', 
});

var productPurchased = [];

connection.connect();


connection.query('SELECT ItemID, ProductName, Price FROM Products', function(err, result){
	if(err) throw err;

	for(var i = 0; i < result.length; i++){
		console.log("Item ID#: " + result[i].ItemID);
		console.log("Product Name: " + result[i].ProductName);
		console.log("Price: " + result[i].Price);
		console.log(" ----------------------------");
	}

	purchase();
});

var purchase = function(){
	var productInfo = {
		properties: {
			itemID:{description: colors.blue('Please enter the ID # of the item you wish to purchase!')},
			Quantity:{description: colors.green('How many items would you like to purchase?')}
		},
	};

	prompt.start();
	prompt.get(productInfo, function(err, res){

		var custPurchase = {
			itemID: res.itemID,
			Quantity: res.Quantity
		};
		
		productPurchased.push(custPurchase);


		connection.query('SELECT * FROM Products WHERE ItemID=?', productPurchased[0].itemID, function(err, res){
				if(err) console.log(err, 'That item ID doesn\'t exist');
				
				if(res[0].StockQuantity < productPurchased[0].Quantity){
					console.log('That product is out of stock!');
					connection.end();
				} else if(res[0].StockQuantity >= productPurchased[0].Quantity){

					console.log('Thank you for your order!');

					console.log(productPurchased[0].Quantity + ' items purchased');

					console.log(res[0].ProductName + ' ' + res[0].Price);

					var totalPrice = res[0].Price * productPurchased[0].Quantity;

					console.log('Total: ' + totalPrice);

					newQuantity = res[0].StockQuantity - productPurchased[0].Quantity;
			
					connection.query("UPDATE Products SET StockQuantity = " + newQuantity +" WHERE ItemID = " + productPurchased[0].itemID, function(err, res){
						// if(err) throw err;
						// console.log('Problem ', err);
						console.log('Your order has been processed.  Thank you for shopping with us!');

						connection.end();
					})

				};

		})
	})

};

