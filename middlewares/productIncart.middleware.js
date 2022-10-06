const { Pincart } = require("../models/productsInCart.model");
const { Cart } = require("../models/cart.model");

//Utils...
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");

const productsInCartExist = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;
    const { productId } = req.params;

    const cart = await Cart.findOne({
        where: { userId: sessionUser.id, status: "active" },
    });
    if (!cart) {
        return next(new AppError("Sorry...add products to cart", 404));
    }
    const productInCart = await Pincart.findOne({
        where: { id: productId, cartId: cart.id },
    });
    if (!productInCart) {
        return next(new AppError("Sorry...product not found", 404));
    }

    req.productInCart = productInCart;
    next();
});

module.exports = { productsInCartExist };
