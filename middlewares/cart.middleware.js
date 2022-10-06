// Models
const { Cart } = require('../models/cart.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

//order.req
const cartExists = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;

    const cart = await Cart.findOne({
        where: { status: "active", userId: sessionUser.id },
    });

    if (cart) {
        req.cart = cart;
        next();
    } else {
        const cart = await Cart.create({
            userId: sessionUser.id,
        });
        req.cart = cart;
        next();
    }
});

module.exports = {
    cartExists
};
