class AppError extends Error {
	constructor(message, statusCode) {
		super(message);

		this.message = message;
		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith('4') ? 'error' : 'fail';

		//Captura el error y lo agrega a la instancia AppError
		Error.captureStackTrace(this);
	}
}

module.exports = { AppError };
