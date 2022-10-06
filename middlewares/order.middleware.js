// Models
const { Order } = require('../models/order.model');
const { Cart } = require('../models/cart.model');
const { Pincart } = require('../models/productsInCart.model');
const { Product } = require('../models/product.model')

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

//order.req
const orderExists = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const order = await Order.findOne({
        where: { id },
        include: {
            model: Cart,
            include: {
                model: Pincart,
                where: { status: 'purchased' },
                include: { model: Product }
            }
        }
    });

    // If user doesn't exist, send error message
    if (!order) {
        return next(new AppError('Order not found', 404));
    }

    // req.anyPropName = 'anyValue'
    req.order = order;
    next();
});

module.exports = {
    orderExists
};
