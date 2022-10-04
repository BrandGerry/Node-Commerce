const express = require('express');

// Controllers
const {
	createUser,
	updateUser,
	deleteUser,
	getAllUserOrder,
	getAllUserProducts,
	getIdUserOrder,
	login
} = require('../controllers/users.controller');

// Middlewares
const { userExists } = require('../middlewares/users.middlewares');
const { protectSession, protectUsersAccount, protectAdmin } = require('../middlewares/auth.middlewares');
const { createUserValidators } = require('../middlewares/validators.middlewares');
const { orderExists } = require('../middlewares/order.middleware')

//Router
const userRouter = express.Router();

//ENDPOINTS
userRouter.post('/login', login)
userRouter.post('/', createUserValidators, createUser)

userRouter.get('/me', protectSession, protectAdmin, getAllUserProducts)
userRouter.patch('/:id', protectSession, userExists, protectUsersAccount, updateUser)
userRouter.delete('/:id', protectSession, userExists, protectUsersAccount, deleteUser)

//With order
userRouter.get('/orders', protectSession, getAllUserOrder)
userRouter.get('/orders/:id', protectSession, orderExists, getIdUserOrder, getOnlyOrderByUser)


module.exports = { userRouter };
