const { body, validationResult } = require('express-validator');

// Utils
const { AppError } = require('../utils/appError.util');

const checkValidations = (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		// [{ ..., msg }] -> [msg, msg, ...] -> 'msg. msg. msg. msg'
		const errorMessages = errors.array().map(err => err.msg);

		const message = errorMessages.join('. ');

		return next(new AppError(message, 400));
	}

	next();
};

const createUserValidators = [
	body('name')
		.isString()
		.withMessage('Name must be a string')
		.notEmpty()
		.withMessage('Name cannot be empty')
		.isLength({ min: 3 })
		.withMessage('Name must be at least 3 characters'),
	body('email').isEmail().withMessage('Must provide a valid email'),
	body('password')
		.isString()
		.withMessage('Password must be a string')
		.notEmpty()
		.withMessage('Password cannot be empty')
		.isLength({ min: 8 })
		.withMessage('Password must be at least 8 characters'),
	checkValidations,
];

const createProductValidators = [
	body('title')
		.isString()
		.withMessage('Title must be a string')
		.notEmpty()
		.withMessage('Title cannot be empty')
		.isLength({ min: 3 })
		.withMessage('Title must be at least 3 characters'),
	body('description')
		.isString()
		.withMessage('Description must be a string')
		.notEmpty()
		.withMessage('Description cannot be empty')
		.isLength({ min: 5 })
		.withMessage('Description must be at least 5 characters'),
	body('quantity')
		.isNumeric()
		.withMessage('Quantity is a number')
		.notEmpty()
		.withMessage('Quantity cannot be empty'),
	body('price')
		.isNumeric()
		.withMessage('Price is a number')
		.notEmpty()
		.withMessage('Price cannot be empty'),
	checkValidations,
];

const createCategoryValidators = [
	body('name')
		.isString()
		.withMessage('Name must be a string')
		.notEmpty()
		.withMessage('Name cannot be empty'),
	checkValidations,
];


module.exports = { createUserValidators, createProductValidators, createCategoryValidators };
