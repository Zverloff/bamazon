var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err
})

var start = function() {
connection.query("SELECT * FROM products", function(err, res) {
    for (var i = 0; i < res.length; i++) {
        console.log("\nItem Id: " + res[i].item_id + "\nProduct Name " + res[i].product_name + "\nDepartment: " + res[i].department + "\nPrice: " + res[i].price + "\nQuantity: " + res[i].quantity);
    }
        console.log("-----------------------------------");
        mainMenu()
})
}
start()    

var mainMenu = function() {
    
    inquirer
    .prompt([
        {
            name: "itemName",
            type: "input",
            message: "What is the Item ID of the item you would like to buy?"     
        },
        {
            name:"number",
            type: "input",
            message: "How many would you like?"
        }    
    ]).then(function(answer) {
        var item = answer.itemName
        var quantity = answer.number
        var query = "SELECT * FROM products WHERE ?";

        connection.query(query, {item_id: item}, function(err, res) {
            
            if (quantity < res[0].quantity) {
                console.log("You have ordered " + quantity + " " + res[0].product_name)
                connection.query("UPDATE products SET ? WHERE ?", [{
                    quantity: res[0].quantity - quantity
                }], function(err,res) {} )
                start()
            }
            else
            console.log("I'm sorry, we don't have that many. Please select again.")
            start()
        })
            
    })
        
}
