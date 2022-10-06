const { ref, uploadBytes } = require('firebase/storage')
// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');
const { storage } = require('../utils/firebase.util')

// Models
const { Category } = require('../models/category.model');
const { Product } = require('../models/product.model')
const { ProductImg } = require('../models/productImg.model')


const createProduct = catchAsync(async (req, res, next) => {

    const { title, description, quantity, categoryId, price } = req.body
    const { sessionUser } = req
    //Automatizarlo ver en post
    const newProduct = await Product.create({
        title, description, quantity, price, categoryId, userId: sessionUser.id
    })

    //Firebase
    const [originalName, ext] = req.file.originalname.split('.')
    const fileaname = `${originalName}-${Date.now()}.${ext}`
    const imgRef = ref(storage, fileaname)

    //Uploadbase
    const result = await uploadBytes(imgRef, req.file.buffer)

    await ProductImg.create({
        productId: newProduct.id,
        imgUrl: result.metadata.fullPath
    })

    res.status(201).json({
        status: 'Success',
        data: { newProduct },
    })

})

const getAllProducts = catchAsync(async (req, res, next) => {

    const produts = await Product.findAll({
        where: { status: 'active' }
    })
    res.status(200).json({
        status: 'Sucess',
        data: {
            produts
        }
    })

})

const getOneProduct = catchAsync(async (req, res, next) => {

    const { id } = req.params
    const product = await Product.findOne({
        where: { id }
    })
    res.status(200).json({
        status: 'Sucess',
        data: {
            product
        }
    })

})

const updatedProduct = catchAsync(async (req, res, next) => {

    const { title, description, quantity, price } = req.body
    const { product } = req
    await product.update({ title, description, quantity, price })
    res.status(200).json({
        status: 'Sucess',
        data: {
            product
        }
    })

})

const deleteProduct = catchAsync(async (req, res, next) => {

    const { product } = req
    await product.update({ status: 'deleted' })
    res.status(200).json({
        status: 'Success'
    })

})

const getAllCategories = catchAsync(async (req, res, next) => {

    const categorys = await Category.findAll({
        where: { status: 'active' }
    })
    res.status(200).json({
        status: 'Sucess',
        data: {
            categorys
        }
    })

})

const createCategories = catchAsync(async (req, res, next) => {

    const { name } = req.body
    const newCategory = await Category.create({ name })
    res.status(201).json({
        status: 'Success',
        data: { newCategory },
    })

})

const updatedCategories = catchAsync(async (req, res, next) => {

    const { category } = req
    const { name } = req.body
    await category.update({ name })
    res.status(201).json({
        status: 'Success',
        data: { category },
    })

})

module.exports = {
    createProduct,
    getAllProducts,
    getOneProduct,
    updatedProduct,
    deleteProduct,
    getAllCategories,
    createCategories,
    updatedCategories
}