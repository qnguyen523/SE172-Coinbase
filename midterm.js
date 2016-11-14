// Name: Quoc Nguyen
// Class: CMPE/SE172
// Midterm Assignment
// get API from node_modules
var request = require('request');
var csv = require('csv');
const repl = require('repl');
var fs = require('fs');
// define a class to handle output to csv file
var method = Output.prototype;
// Constructor
function Output(transactionMessage, time) {
  // always initialize all instance properties
  this.transactionMessage = transactionMessage;
  this.time = time;
}
method.getTransactionMessage = function() {
    return this.transactionMessage;
};
method.getTime = function() {
    return this.time;
};
// export the class
module.exports = Output;
// declare variables
var csvOutput = new Array();
var exchangeMap = {};
var arrayOfBody=[];
function myFunction()
{
	request('https://coinbase.com/api/v1/currencies/exchange_rates', function (error, response, body)
	{
		// if there is no errors and the request is succeeded
		if (!error && response.statusCode == 200) 
      	{
	        // Show the HTML for the Google homepage.
	        // first split by ",""
	        arrayOfBody = body.split(",");
	        // then remove all unneccessary punctuation and return a string
	        arrayOfBody = arrayOfBody.map(function(testing, index, array)
	        {
	            var array2 = testing.split(":");
	            var conversionName = array2[0].replace('{', '').replace(/\"/g, '');
	            var conversionRate = array2[1].replace('}', '').replace(/\"/g, '');
				// I use associative array to store conversionName and conversionRate
	            exchangeMap[conversionName] = conversionRate;
	        });
		}
		// welcome messages
		console.log("Welcome to BitCoin Exchange.");
	    console.log("Please follow this format: buy <amount> <currency>");
	    console.log("For example: buy 30 usd")
	    const r = repl.start({prompt: 'coinbase>', eval: myEval, writer: myWriter});
	    function myEval(cmd, context, filename, callback)
	    {
	        callback(null,cmd);
	    }
	    function myWriter(output)
	    {
	    	// take care of input from users
	    	// remove all white space
	    	var splittedString = output.toString().toLowerCase().replace(/(\r\n|\n|\r)/gm,"").split(" ");
	    	var temp="";
	    	// when users type "orders"
	    	if(splittedString[0] == "orders")
	    	{
	    		var outputArray = [];
	    		var outputToCsv = "";
		        for (var i = 0; i < csvOutput.length-1; i++)
		        {
		        	// seperated by ","
		        	var hold = csvOutput[i].getTime()+" : "+csvOutput[i].getTransactionMessage().replace(/\ /g, ',');
		        	if(i==0)
		        		outputToCsv=hold;
		        	else
		        		// seperated by "\n"
		        		outputToCsv=(outputToCsv + "\n").concat(hold);
		        }
		        console.log("===CURRENT ORDER===:");
		        console.log(csvOutput[csvOutput.length-1].getTime()+" : "+csvOutput[csvOutput.length-1].getTransactionMessage()+" : unfilled");

				csv()
				.from(outputToCsv)
				.to('output.csv')
	    		console.log("You are done. All information is saved on .cvs file");
	    	}
	   		// if users type input in a wrong format
	   		if (splittedString[0] == "orders")
	        {
	        	return "Type .exit to exit the REPL mode.";
	        }
	    	else if(splittedString[0] !== "buy" && splittedString[0] !== 'sell' )
	        {
	            return "Error in format.";
	        }
	        else if(splittedString.length < 2)
	        {
	        	return "Error in format. No amount specified.";
	        }
	        else if(splittedString.length < 3)
	        {
	        	temp = "btc_to_btc";
	        }
	        else if (splittedString.length == 3)
	        {
	        	temp = splittedString[2].replace(/(\r\n|\n|\r)/gm,"").concat("_to_btc");	
	        }
	        else
	        {
	        	return "Error in format.";
	        }
	        // if users type input with invalid currency
	        if (!exchangeMap[temp])
	        {
	        	return "Error. Invalid currency. Order fails.";
	        }
	        // if users type input with invalid number
	        else if(!parseInt(splittedString[1]))
	        {
	        	return "Error in format.";
	        }
	        // this is an exchange rate of the transaction
	    	var exchangeRate = parseFloat(exchangeMap[temp]);
	    	console.log("The rate is: " + exchangeRate);
	    	// this is the amount of currency
	        var amount = parseInt(splittedString[1]);
	        // when users follow correct format with 3 words
	        // for example: buy 10 usd
	        if(splittedString.length == 3)
	        {
	        	var str = "Order to " + output.toString().toUpperCase().replace(/(\r\n|\n|\r)/gm,"") 
	        	+" worth of BTC queued @ "+ 1/exchangeRate +"BTC/"+splittedString[2].toUpperCase()+" "+amount*exchangeRate;
	        	csvOutput.push(new Output(str, Date()));
	        	return "Order to " + output.toString().toUpperCase().replace(/(\r\n|\n|\r)/gm,"") 
	        	+" worth of BTC queued @ "+ 1/exchangeRate +"BTC/"+splittedString[2].toUpperCase()+" ("+amount*exchangeRate+")";
	        }
	        // when users follow correct format with 2 words. 
	        // for example: buy 10
	        var str = "Order to " + output.toString().toUpperCase().replace(/(\r\n|\n|\r)/gm,"")+" BTC queued.";
	        csvOutput.push(new Output(str, Date()));
	        return str;
	    }
	});
};
myFunction();

