const express = require('express');

// Controllers
const {
    createCategories, createProduct,
    deleteProduct, getAllCategories,
    getAllProducts, getOneProduct,
    updatedCategories, updatedProduct
} = require('../controllers/product.controller');

// Middlewares
const { categoryExists } = require('../middlewares/category.middleware');
const { protectSession, protectUsersAccount, protectAdmin } = require('../middlewares/auth.middlewares');
const { createProductValidators, createCategoryValidators } = require('../middlewares/validators.middlewares');
const { productExists } = require('../middlewares/product.middleware')

//Utils
const { upload } = require('../utils/multer.util')
//Router
const productRouter = express.Router();

//ENDPOINTS
productRouter.post('/', upload.array('productImg'), createProductValidators, createProduct)

productRouter.get('/', protectSession, getAllProducts)
productRouter.get('/:id', protectSession, getOneProduct)

productRouter.patch('/:id', protectSession, productExists, protectUsersAccount, updatedProduct)
productRouter.delete('/:id', protectSession, productExists, protectUsersAccount, deleteProduct)

//With category
productRouter.get('/categories', protectSession, getAllCategories)
productRouter.post('/categories', protectSession, createCategoryValidators, createCategories)
productRouter.patch('/categories/:id', protectSession, categoryExists, protectUsersAccount, updatedCategories)


module.exports = { productRouter };
