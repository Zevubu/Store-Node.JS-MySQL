# Store-Node.JS-MySQL
 Amazon-like storefront the operates in your terminal.

Begin by going to bamazonCustomer.js. This will give you 4 options: Look, Buy, Manager, exit 
    $ node bamazonCustomer.js                                                                                                                                                                                          Connection thread id 65
    ?
    Welcome to The Hats, Mats, Rats, & Cats Emporium!
    Please chose one (Use arrow keys)
    > Browse available items
    Know what you want? Jump straight to buying it.
    Management Login
    Exit
If you chose to "Browse available items" this menu will open
    > Show all products.
    Search for product by ID.
    Search for product by name.
    Search for product by department.
    Exit
Then once that's open at the bottom you can decide which item you would like to buy.
    What is the product id # of the item you would like to purchase?
    &
    How many do you want?

then

    Congratulations, the product you requested is in stock! Placing order!
    there are now 1989 Big Hat's left.

    Order info
    ---------------------------------------------------------------------
    UPDATE products SET `stock_quantity` = 1989 WHERE `item_id` = 1
    ---------------------------------------------------------------------

    Your order has been placed! Your total is $100.
    Thanks for shopping at The Hats, Mats, Rats, & Cats Emporium!
    ---------------------------------------------------------------------

and restarts you at the order screen:

    ?
    Welcome to The Hats, Mats, Rats, & Cats Emporium!
    Please chose one (Use arrow keys)
    > Browse available items
    Know what you want? Jump straight to buying it.
    Managament Login
    Exit
