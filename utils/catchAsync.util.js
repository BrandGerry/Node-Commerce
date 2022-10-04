// fn -> Controlador de la funcion o un middleware
const catchAsync = fn => {
	return (req, res, next) => {
		fn(req, res, next).catch(err => next(err));
	};
};

module.exports = { catchAsync };
