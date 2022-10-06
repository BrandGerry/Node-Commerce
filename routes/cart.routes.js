const express = require("express");

//Controllers...
const { addProductsInCart, purchaseCart, removeProductFromCart, updatedProductInCart } = require("../controllers/cart.controller");

//Middlewares...
const { protectSession } = require("../middlewares/auth.middlewares");
const { cartExists } = require("../middlewares/cart.middleware");
const { productsInCartExist } = require("../middlewares/productIncart.middleware");

//ESTABLISHING ROUTES...
const cartRouter = express.Router();

//Protecting session...
cartRouter.use(protectSession);

cartRouter.post("/add-product", cartExists, addProductsInCart);
cartRouter.patch("/update-cart", updatedProductInCart);
cartRouter.delete("/:productId", productsInCartExist, removeProductFromCart);
cartRouter.post("/purchase", purchaseCart);

module.exports = { cartRouter };
