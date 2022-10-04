// Models
const { User } = require('./user.model');
const { ProductImg } = require('./productImg.model')
const { Product } = require('./product.model')
const { Pincart } = require('./productsInCart.model')
const { Cart } = require('./cart.model')
const { Order } = require('./order.model')
const { Category } = require('./category.model')



const initModels = () => {
    //1 Product <-------> M images
    Product.hasMany(ProductImg, { foreignKey: 'productId' })
    ProductImg.belongsTo(Product)

    //1 Productincart <-------> M images
    Pincart.hasMany(ProductImg, { foreignKey: 'productId' })
    ProductImg.belongsTo(Pincart)

    //1 Cart <-------> M Productincart
    Cart.hasMany(Pincart, { foreignKey: 'cartId' })
    Pincart.belongsTo(Cart)

    //1 User <-------> M Product
    User.hasMany(Product, { foreignKey: 'userId' })
    Product.belongsTo(User)

    //1 User <-------> M Order
    User.hasMany(Order, { foreignKey: 'userId' })
    Order.belongsTo(User)

    //1 User <---> 1 Carts
    User.hasOne(Cart, { foreignKey: "userId" })
    Cart.belongsTo(User)

    //1 order <---> 1 carts
    Order.hasOne(Cart, { foreignKey: "id" })
    Cart.belongsTo(Order)

    //1 product <---> 1 category
    Product.hasOne(Category, { foreignKey: "id" })
    Category.belongsTo(Product)

};

module.exports = { initModels };
