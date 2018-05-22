import CODE from '../constants/codes.js';


export const customErrorHandler = (err, req, res, next) =>{
	console.log('ErrorHandler....',err.code);
	res.status(CODE[err.code]);
	res.send(err);
};

// handle this in the same way you would treat process.on('uncaughtException')
// it is supplied the error as well as the idle client which received the error
export function pgPoolErrorHandler(error) {
	console.error('A pg pool error has occured. %s', error);
}

export function uncaughtExceptionHandler(app) {
	return error => {
		if (app.env == 'development') {
			console.error('An uncaughtException error has occured. %s', error);
		} else {
			console.error('An uncaughtException error has occured.');
			process.exit(1);
		}
	};
}
