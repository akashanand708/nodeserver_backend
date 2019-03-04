import CODE from '../constants/codes.js';


export const customErrorHandler = (err, req, res, next) =>{
	console.log('ErrorHandler....',err.code);
	res.status(CODE[err.code]);
	res.send(err);
};

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
