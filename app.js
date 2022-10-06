const express = require('express');
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

// Routers
const { userRouter } = require('./routes/users.routes');
const { productRouter } = require('./routes/product.routes')
const { cartRouter } = require("./routes/cart.routes");

// Controllers
const { globalErrorHandler } = require('./controllers/error.controller');

// Init our Express app
const app = express();

// Enable Express app to receive JSON data
app.use(express.json());

//Addin security headers...
app.use(helmet());
//Compressing responses...
app.use(compression());

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
else if (process.env.NODE_ENV === "production") app.use(morgan("combined"));


// Define endpoints
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter)
app.use('/api/v1/carts', cartRouter)

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
