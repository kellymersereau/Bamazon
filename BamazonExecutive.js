var mysql = require('mysql');
var prompt = require('prompt');
var colors = require('colors/safe');
var Table = require('cli-table');
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'Bamazon', 
});

var newDept = [];


connection.connect();

var executiveOptions = {
	properties:{
		eOptions:{
			description: colors.blue('Key in one of the following options: 1) View Product Sales by Department 2) Create New Department')
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
	var table = new Table({
		head: ['Department ID', 'Department Name', 'Overhead Cost', 'Total Sales', 'Total Profit'],
		style: {
			head:['blue'],
			compact: false,
			colAligns: ['center'],
		}
	});
	console.log(' ');
	console.log(colors.black.bgWhite.underline('Product Sales by Department'));

	connection.query('SELECT * FROM totalprofits', function(err, res){
		if(err) console.log('Error: ' + err);

		for(var i = 0; i<res.length; i++){
			table.push(
				[res[i].DepartmentId, res[i].DepartmentName, res[i].OverHeadCosts, res[i].TotalSales, res[i].TotalProfit]
				);
		}

		console.log(' ');
		console.log(table.toString());
		connection.end();
	})
};

var createDepartment = function(){
	var newDepartment = {
		properties: {
			newDeptName:{ description: colors.magenta('Please enter the name of the new department you would like to add.')
			},
			newOverhead:{ description: colors.magenta('What are the overhead costs for this department?')
			},
		}
	}

	prompt.start();

	prompt.get(newDepartment, function(err, res){

		var newDeptInfo = {
			deptName: res.newDeptName,
			overHeadNew: res.newOverhead,
			autoTotalSales: 0,
		};

		newDept.push(newDeptInfo);

		connection.query('INSERT INTO Departments (DepartmentName, OverHeadCosts, TotalSales) VALUES (?, ?, ?);', [newDept[0].deptName, newDept[0].overHeadNew, newDept[0].autoTotalSales], function(err, result){
			if(err){
				console.log('Error: ' + err);
				connection.end();
			} else {
				console.log('');
				console.log(colors.blue.underline('New Department sucessfully created!'));
				console.log(' ');
				connection.end();
			}
		})
	})
};