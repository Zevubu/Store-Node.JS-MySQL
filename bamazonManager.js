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
    // list every available item: the item IDs, names, prices, and quantities.
    connection.query("SELECT * FROM products", function(err, res){
        if(err) throw err;
        console.log("\n")
        for (let i = 0; i < res.length;i++){

            console.log(`ID ${res[i].item_id}: Item name ${res[i].product_name}, Department ${res[i].department_name}, Price $${res[i].price}, currently in stock ${res[i].stock_quantity}.`)
        };
        Managment();
    })
}
    

function lowProducts (){
    connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function(err,res){
        if(err) throw err;
        console.log("\n");
        for (let i = 0; i < res.length;i++){

            console.log(`ID ${res[i].item_id}: Item name ${res[i].product_name}, Department ${res[i].department_name}, Price $${res[i].price}, currently in stock ${res[i].stock_quantity}.`)
        };
        Managment();
    })
    // list all items with an inventory count lower than five.
    
};
function validateInput(value){
    let integer = Number.isInteger(parseFloat(value));
    let sign = Math.sign(value);

    if (integer && (sign === 1)) {
        return true;
    }else{
        return 'Please enter a whole non-zero number.';
    };

};

function addInventory (){
    // display a prompt that will let the manager “add more” of any item currently in the store.
    Inquirer
    .prompt([
        {
        name: "ItemID",
        type:"input",
        message: "What item would you like to add more of.",
        validate: validateInput,
        filter: Number
        },{
        name: "quantity",
        type:"input",
        message: "how many are you adding",
        validate: validateInput,
        filter: Number 
        }

    ]).then(function(input){
        let item = input.itemId;
        let quantity = input.quantity;

        let queryStr =  'SELECT * FROM products WHERE ?';

        connection.query(queryStr, {item_id:item}, function(err,data){
            if(err) throw err;
            let productData = data[0]
            console.log('productData = ' + JSON.stringify(productData));
            // console.log('productData.stock_quantity = ' + productData.stock_quantity);

            // console.log()

            if(data.length === 0){
                console.log(`ERROR: Invalid Item ID. Please select a valid Item ID.`);
                addInventory();
            }else{
                let productData = data[0]
                console.log('productData = ' + JSON.stringify(productData));
				console.log('productData.stock_quantity = ' + productData.stock_quantity);
            }
        });
        
        // Managment();

    })
    
  
};

function addProduct (){
    // allow the manager to add a completely new product to the store.
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
// let connecting = function(){


connection.connect(function(err){
    if(err) throw err;
    console.log(`Connection thread id ${connection.threadId}`)
    Managment();
})
// }


// module.exports = connecting;