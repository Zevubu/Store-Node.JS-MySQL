let Mysql = require("mysql");
let Inquirer = require("inquirer");
let Managment = require("./bamazonManager")
let Keys = require("./keys");

let query = "SELECT * FROM products WHERE ?";

let connection = Mysql.createConnection({
    host:"localhost",
    port:3306,
    user:"root",
    password:Keys.SQLKEY,
    database:"bamazonDB"

});

function validateInput(value) {
	let integer = Number.isInteger(parseFloat(value));
	let sign = Math.sign(value);

	if (integer && (sign === 1)) {
		return true;
	} else {

		return 'Please enter a whole non-zero number.';
	}
}

let orderForm = function(){
    Inquirer
    .prompt([
        {
        name:"itemId",
        type:"input",
        message:"What is the product id # of the item you would like to purchase?",
        validate: validateInput,
        filter:Number
    },
    {
        name:"quantity",
        type:"input",
        message:"How many do you want?",
        validate: validateInput,
        filter:Number
    }
    ]).then(function(input){
        let item = input.itemId;
        let quantity = input.quantity;
        
        connection.query(query, {item_id: item}, function(err,data){
            if(err) throw err;
            // console.log('data = ' + JSON.stringify(data));
            if (data.length === 0){
                console.log(`ERROR: Invalid Item ID. Please select a valid Item ID.`)
                productSearch();
            }
            else{
                let productData = data[0];

                //  console.log('productData = ' + JSON.stringify(productData));
                // console.log('productData.stock_quantity = ' + productData.stock_quantity);
                
                if (quantity <= productData.stock_quantity){
                    console.log('\nCongratulations, the product you requested is in stock! Placing order!');

                    // let updateQueryStr = `UPDATE product SET stock_quantity = ${productData.stock_quantity - quantity} WHERE item_id = ${item}`;
                    let newQuantity = productData.stock_quantity - quantity; 
                    console.log(`there are now ${newQuantity} ${productData.product_name}'s left.`)
                    let updateQueryStr = connection.query("UPDATE products SET ? WHERE ?",
                    [
                      {
                        stock_quantity: newQuantity
                      },
                      {
                        item_id: item
                      }
                    ],
                    function(err,data){
                        if(err) throw err;
                        // console.log(`Item effected ${data}`)
                        
                        console.log(`Your order has been placed! Your total is $${productData.price*quantity}.`);
                        console.log("Thanks for shopping at The Hats, Mats, Rats, & Cats Emporium!")
                        console.log("\n---------------------------------------------------------------------\n")
                        loginScreen();
                        
                    })
                    console.log("\nOrder info\n---------------------------------------------------------------------");
                    console.log(updateQueryStr.sql)
                    console.log("---------------------------------------------------------------------\n");
                }else{
                    console.log('Sorry, there is not enough product in stock, your order can not be placed as is.');
					console.log('Please modify your order.');
                    console.log("---------------------------------------------------------------------\n");
                    loginScreen();
                }
            }
        })
    })
}

function allSearch(){
    connection.query("SELECT * FROM products", function(err, res){
        if(err) throw err;
        for (let i = 0; i < res.length;i++){

            console.log(`ID ${res[i].item_id}: Item name ${res[i].product_name}, Department ${res[i].department_name}, Price $${res[i].price}, currently in stock ${res[i].stock_quantity}.`)
        };
        orderForm();
       
    })
}


function nameSearch(){
    console.log("name check")
    Inquirer
        .prompt({
            name:"item_name",
            type:"input",
            message:"\nWhat item would you like to search for? \n(try: floofy, top hat, Big hat, old mat, greasy.) "
        })
        .then(function(answer){
            console.log(answer.item_name);
            connection.query(query, {product_name: answer.item_name}, function(err, res){
                if(err) throw err;
                for (i = 0; i < res.length;i++){
                    console.log(`\nID:${res[i].item_id}. Item Name: ${res[i].product_name}. Department: ${res[i].department_name}. Price: ${res[i].price}. Quantity: ${res[i].stock_quantity}. \n`)
                }
                
            })
            orderForm();  
        })
};

function idSearch(){

    console.log("id check")
    Inquirer
        .prompt({
            name:"item_id",
            type:"input",
            message:"\nPlease enter the id number of the item you would like to see. \n"
        })
        .then(function(answer){
            console.log(answer.item_id);
            connection.query(query, {item_id: answer.item_id}, function(err, res){
                if(err) throw err;
                for (i = 0; i < res.length;i++){
                    console.log(`\nID:${res[i].item_id}. Item Name: ${res[i].product_name}. Department: ${res[i].department_name}. Price: ${res[i].price}. Quantity: ${res[i].stock_quantity}. \n`)
                }
                
            })
            orderForm();  
        })
};

function departmentSearch(){
    console.log("Department check")
    Inquirer
        .prompt({
            name:"department",
            type:"list",
            message:"\nWhat department would you like to see? \n",
            choices:[
                "hats",
                "mats",
                "cats",
                "rats"
            ]
        })
        .then(function(input){
            console.log(input.department);
            connection.query(query, {department_name: input.department}, function(err, res){
                if(err) throw err;
                for (i = 0; i < res.length;i++){
                    console.log(`\nID:${res[i].item_id}. Item Name: ${res[i].product_name}. Department: ${res[i].department_name}. Price: ${res[i].price}. Quantity: ${res[i].stock_quantity}. \n`)
                }
                
            })
            orderForm();  
  
        })
};



function productSearch(){
    Inquirer
        .prompt({
            name:"search",
            type: "list",
            message:"\nWelcome to The Hats, Mats, Rats, & Cats Emporium! \n What can we help you find?",
            choices:[
                "Show all products.",
                "Search for product by ID.",
                "Search for product by name.",
                "Search for product by department.",
                "Exit"
            ]
        })
        .then(function(input){
            switch(input.search){
                case "Show all products.":
                    allSearch();
                    break;
                case "Search for product by name.":
                    nameSearch();
                    break;
                case "Search for product by ID.":
                    idSearch();
                    break;
                case "Search for product by department.":
                    departmentSearch();
                    break;
                case "Exit":
                    connection.end();
                    break;
            }
        });
};

// let loginBase = function(){
//     Inquirer
//      .prompt({
//          name: "login",
//          type:"input",
//          message: "Please put in you user name. (Use: Pip)"
//      },
//      {
//          name:"password",
//          type:"input",
//          message:"Enter your password. (Use: password)"
//      }).then(function(info){
//          let userName = info.login;
//          let userPassword = info.password;
//          if(userName === "Pip" || userName === "pip" && userPassword === "password"){
//              loginOptions();
//          }


//      })
// };

//  let staffLogin = function(){
    
//  };

function loginScreen(){
    Inquirer
        .prompt({
            name:"search",
            type: "list",
            message:"\nWelcome to The Hats, Mats, Rats, & Cats Emporium! \n Please chose one",
            choices:[
                // "login",
                "Browse available items",
                "Know what you want? Jump straight to buying it.",
                "Managament Login",
                "Exit"
            ]
        })
        .then(function(input){
            switch(input.search){
                // case "login":
                //     loginBase();
                //     break;
                case "Browse available items":
                    productSearch();
                    break;
                case "Know what you want? Jump straight to buying it.":
                    orderForm();
                    break;
                case "Managament Login":
                    Managment();
                    break;
                case "Exit":
                    connection.end();
                    break;
            }
        });
};

connection.connect(function(err){
    if(err) throw err;
    console.log(`Connection thread id ${connection.threadId}`)
    loginScreen();
})
// module.exports = loginScreen;