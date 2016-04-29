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
var newQuantity = 0;

connection.connect();
prompt.start();

connection.query('SELECT ItemID, ProductName, Price FROM Products', function(err, result){
	if (err) throw err;

	for(var i = 0; i < result.length; i++){
		console.log("Item ID#: " + result[i].ItemID);
		console.log("Product Name: " + result[i].ProductName);
		console.log("Price: " + result[i].Price);
		console.log(" ");
	}

	prompt.get({
		properties: {
			productPurchasedId: {
				description: colors.blue('Enter the ID # of the product you wish you purchase.')
			}
		}
	}, function(err, res){
		if(err) throw err;
		productPurchasedId = res.productPurchasedId;
		prompt.get({
			properties: {
				productPurchasedQuantity: {
					description: colors.green('How many items would you like to purchase?')
				}
			}
		}, function(err, res){
			productPurchasedQuantity = res.productPurchasedQuantity;
			checkForItem();
			connection.end();
		})
	})

});
var checkForItem = function(){
	connection.query('SELECT * FROM Products WHERE Products.ItemID = ?', productPurchasedId, function(err, resOne){
		if(err) console.log(err, 'That item ID doesn\'t exist');
		// console.log(resOne[0].StockQuantity);
		if(resOne[0].StockQuantity < productPurchasedQuantity){
			console.log('Insufficient quantity!');
		} else if(resOne[0].StockQuantity >= productPurchasedQuantity){

			console.log('Thank you for your order!');

			console.log(productPurchasedQuantity + ' items purchased');

			console.log(resOne[0].ProductName + ' ' + resOne[0].Price);

			var totalPrice = resOne[0].Price * productPurchasedQuantity;

			console.log('Total: ' + totalPrice);

			newQuantity = resOne[0].StockQuantity - productPurchasedQuantity;
			updateDatabase();

		}
	})
};

var updateDatabase = function(){
	connection.query("UPDATE Products SET StockQuantity = ? WHERE ItemID = ?", newQuantity, productPurchasedId, function(err, res){
		if(err) throw err;
		// 	console.log('Problem ', err);
		// } else {
			console.log(res[0].StockQuantity);
		// }

	})
};

