// module.exports = function(){

    let Mysql = require("mysql");
    let Inquirer = require("inquirer");
    // let loginScreen = require("./bamazonCustomer")
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
                Managment();
            };
            
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
            let item = input.ItemID;
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
                    productData = data[0]
                    // console.log('productData = ' + JSON.stringify(productData));
                    // console.log('productData.stock_quantity = ' + productData.stock_quantity);
                    console.log(`Updating inventory...`);

                    let updateQuery = `UPDATE products SET stock_quantity = ${productData.stock_quantity + quantity} WHERE item_id = ${item}`;
                    connection.query(updateQuery, function(err, data){
                        if(err) throw err;
                        // console.log(`data count: ${JSON.stringify(productData)}`)
                        console.log(`Stock count for Item ID ${item} has been updated to ${productData.stock_quantity + quantity}.`)
                        console.log('\n------------------------------------------\n');
                        Managment();
                    })
                }
            });
        })
    };

    function addProduct (){
        Inquirer
        .prompt([
            {
                type: "input",
                name:"product_name",
                message: "Please enter the new product name."
            },{
                name:"department",
                type: "list",
                message: "Which department?",
                choices:[
                    "hats",
                    "mats",
                    "cats",
                    "rats"
                ]
            },{
                type: "input",
                name:"price",
                message: "Please enter the products price.",
                validate: validateInput
            },{
                type: "input",
                name:"quantity",
                message: "How many do you have in stock.",
                validate: validateInput
            },
            
        ]).then(function(input){
            console.log(`Adding new item: \n product name= ${input.product_name} \n Deparment name = ${input.department_name} \n price = ${input.price}\n Stock Qauntity = ${input.stock_quantity}`);

            queryStr = "INSERT INTO products SET ?";

            connection.query(queryStr,{product_name: input.product_name, department_name: input.department, price: input.price, stock_quantity: input.quantity}, function(err,res){
                if (err) throw err;

                console.log(`New product has been added to the inventory under Item ID ${res.insertId}.`);
            console.log("\n---------------------------------------------------------------------\n");
             Managment();
            })
        })
        // allow the manager to add a completely new product to the store.
       
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
                    "Exit"
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
    let connecting = function(){
           
        connection.connect(function(err){
            if(err) throw err;
            console.log(`Connection thread id ${connection.threadId}`)
            Managment();
        })
    }
    // connecting()
// }
module.exports = connecting;