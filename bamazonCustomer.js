let Mysql = require("mysql");
let Inquirer = require("inquirer");
let Keys = require("./keys");

let connection = Mysql.createConnection({
    host:"localhost",
    port:3306,
    user:"root",
    password:Keys.SQLKEY,
    database:"bamazonDB"

});

function allSearch(){
    connection.query("SELECT * FROM products", function(err, res){
        if(err) throw err;
        for (let i = 0; i < res.length;i++){
             console.log(`ID ${res[i].item_id}: Item name ${res[i].product_name}, Department ${res[i].department_name}, Price $${res[i].price}, currently in stock ${res[i].stock_quantity}.`)
        };
        productSearch();
       
    })
}

function nameSearch(){
    productSearch();
};

function idSearch(){
    productSearch();
};

function departmentSearch(){
    productSearch();
};

function productSearch(){
    Inquirer
        .prompt({
            name:"search",
            type: "list",
            message:"\n Welcome to The Hats, Mats, Rats, & Cats Emporium! \n What can we help you find?",
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

connection.connect(function(err){
    if(err) throw err;
    console.log(`Connection thread id ${connection.threadId}`)
    productSearch();
})