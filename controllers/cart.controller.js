//UTILS
const { catchAsync } = require('../utils/catchAsync.util')
const { AppError } = require('../utils/appError.util')

//MODELS
const { Cart } = require('../models/cart.model')
const { Product } = require('../models/product.model')
const { Pincart } = require('../models/productsInCart.model')
const { Order } = require('../models/order.model')

const getUserCart = catchAsync(async (req, res, next) => {
})

const addProductsInCart = catchAsync(async (req, res, next) => {
    const { sessionUser } = req
    const { productId, quantity } = req.body

    const product = await Product.findOne({
        where: { id: productId, status: 'active' }
    })

    if (!product) {
        return next(new AppError('Product does not exist', 404))
    } else if (quantity > product.quantity) {
        return next(new AppError('Product only a few items', 404))
    }

    const cart = await Cart.findOne({
        where: { userId: sessionUser.id, status: 'active' }
    })

    if (!cart) {
        const newCart = await Cart.create({ userId: sessionUser.id })
        Pincart.create({ cardId: newCart.id, productId, quantity })

    } else {
        const productIncart = await Pincart.findOne({ where: { productId, cartId: cart.id } })
        if (!productIncart) {
            await Pincart.create({ cartId: cart.id, productId, quantity })
        } else if (productIncart.status === 'active') {
            return next(new AppError('This product is alredy active', 400))
        } else if (productIncart.status === 'removed') {
            await productIncart.update({ status: 'active', quantity })
        }
    }
    res.status(200).json({
        status: 'Sucess'
    })
})

const updatedProductInCart = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({
        where: { userId: sessionUser.id, status: "active" },
    });

    if (!cart) {
        return next(new AppError("Sorry...add products to cart", 404));
    }

    const product = await Product.findOne({ where: { id: productId } });

    const productInCart = await Pincart.findOne({
        where: { productId: product.id, cartId: cart.id },
    });
    if (!productInCart) {
        return next(new AppError("Product not found", 404));
    } else {
        if (product.quantity >= quantity && quantity !== 0) {
            const productUpdated = await productInCart.update({
                quantity,
                status: "active",
            });
            res.status(200).json({
                status: "success",
                data: { productUpdated },
            });
        } else if (quantity === 0) {
            const productUpdated = await productInCart.update({
                quantity,
                status: "removed",
            });
            res.status(200).json({
                status: "success",
                data: { productUpdated },
            });
        } else {
            return next(new AppError("The quantity entered is not available", 404));
        }
    }
})

const purchaseCart = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;

    const cart = await Cart.findOne({
        where: { status: "active", userId: sessionUser.id },
    });
    if (!cart) {
        return next(new AppError("Sorry... add products to cart", 404));
    }

    const productsInCart = await Pincart.findAll({
        where: { cartId: cart.id, status: "active" },
    });

    const purchase = await Promise.all(
        productsInCart.map(async (productInCart) => {
            const product = await Product.findOne({
                where: { id: productInCart.productId },
            });
            const updatedProduct = await product.update({
                quantity: product.quantity - productInCart.quantity,
            });
            const productsPurchased = await productInCart.update({
                status: "purchased",
            });
            const arrayPrices = productInCart.quantity * product.price;

            return arrayPrices;
        })
    );
    let sum = 0;
    for (let i = 0; i < purchase.length; i++) {
        sum += purchase[i];
    }
    const total = sum;
    if (total === 0) {
        return next(new AppError("Sorry... add products to cart", 404));
    } else {
        await cart.update({ status: "purshased" });

        createdOrder = await Order.create({
            userId: sessionUser.id,
            cartId: cart.id,
            totalPrice: total,
        });

        res.status(201).json({
            status: "success",
            data: { createdOrder },
        });
    }
})

const removeProductFromCart = catchAsync(async (req, res, next) => {
    const { productInCart } = req;
    await productInCart.update({
        quantity: 0,
        status: "removed",
    });
    res.status(200).json({
        status: "success",
    });
})

module.exports = {
    addProductsInCart,
    updatedProductInCart,
    removeProductFromCart,
    purchaseCart,
};