// Models
const { Category } = require('../models/category.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

//user.req
const categoryExists = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const category = await Category.findOne({
        where: { id }
    });

    // If user doesn't exist, send error message
    if (!category) {
        return next(new AppError('Category not found', 404));
    }

    // req.anyPropName = 'anyValue'
    req.category = category;
    next();
});

module.exports = {
    categoryExists,
};