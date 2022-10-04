const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// MODELOS
const { User } = require('../models/user.model');

// UTILS
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

dotenv.config({ path: './config.env' });

//sessionUser.req
const protectSession = catchAsync(async (req, res, next) => {
	// Get token
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		// Extraer el token
		// req.headers.authorization = 'Bearer token'
		token = req.headers.authorization.split(' ')[1]; // -> [Bearer, token]
	}

	// Checar si el token fue enviado
	if (!token) {
		return next(new AppError('The token was invalid', 403));
	}

	// Verificar el token
	const decoded = jwt.verify(token, process.env.JWT_SECRET);

	// Verificar si el token es tuyo
	const user = await User.findOne({
		where: { id: decoded.id, status: 'active' },
	});

	if (!user) {
		return next(
			new AppError('The owner of the session is no longer active', 403)
		);
	}

	// Grant access
	req.sessionUser = user;
	next();
});


const protectUsersAccount = (req, res, next) => {
	//Checar el usuario de session para la cuenta
	const { sessionUser, user } = req;
	// const { id } = req.params;
	// If the users (ids) don't match, send an error, otherwise continue
	if (sessionUser.id !== user.id) {
		return next(new AppError('You are not the owner of this account.', 403));
	}
	// If the ids match, grant access
	next();
};


const protectAdmin = (req, res, next) => {
	// Middleware que solo entren admin 
	const { sessionUser } = req;
	if (sessionUser.role !== 'admin') {
		return next(new AppError('You do not have the right access level.', 403));
	}

	next();
};

module.exports = {
	protectSession,
	protectUsersAccount,
	protectAdmin,
};
