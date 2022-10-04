const express = require('express');

// Routers
const { userRouter } = require('./routes/users.routes');
const { productRouter } = require('./routes/product.routes')

// Controllers
const { globalErrorHandler } = require('./controllers/error.controller');

// Init our Express app
const app = express();

// Enable Express app to receive JSON data
app.use(express.json());

// Define endpoints
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter)

// Global error handler
app.use(globalErrorHandler);

// Catch non-existing endpoints
app.all('*', (req, res) => {
	res.status(404).json({
		status: 'error',
		message: `${req.method} ${req.url} does not exists in our server`,
	});
});

module.exports = { app };