let Mysql = require("mysql");
let Inquirer = require("inquirer");
// let Customer = require("./bamazonCustomer")
let Keys = require("./keys");


let query = "SELECT * FROM products WHERE ?";

let connection = Mysql.createConnection({
    host:"localhost",
    port:3306,
    user:"root",
    password:Keys.SQLKEY,
    database:"bamazonDB"

});

function veiwProducts(){
    Managment();
};

function lowProducts (){
    Managment();
};

function addInventory (){
    Managment();
};

function addProduct (){
    Managment();
};



let Managment = function(){
 console.log("managment check")
 Inquirer
 .prompt({
     name:"options",
     type:"list",
     message:"What would you like to do?",
     choices:[
         "View Products for Sale",
         "View Low Inventory",
         "Add to Inventory",
         "Add New Product",
         "exit"
     ]
 })
 .then(function(input){
     switch(input.options){
         case "View Products for Sale":
            veiwProducts()
             break;
        case "View Low Inventory":
            lowProducts()
            break;
        case "Add to Inventory":
            addInventory()
            break;
        case "Add New Product":
            addProduct() 
            break;
        case "Exit":
            connection.end();
            break;
            
             
     }

 })
 
}

module.exports = Managment;