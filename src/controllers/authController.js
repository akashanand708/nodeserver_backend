import error from 'restify-errors';
require('custom-env').env();
import _ from 'lodash';
import * as User from '../models/User.js';
import {
	signUpValidation, logInValidation,
	logOutValidation, resetPasswordValidation, updatePasswordValidation
} from '../middlewares/validations.js';

export function signUp(req, res, next) {
	let name = _.trim(req.body.name),
		email = _.trim(req.body.email),
		password = _.trim(req.body.password);
	signUpValidation(name, email, password, next)
		.then((validationObject) => {
			console.log(`Validation..: ${JSON.stringify(validationObject)}`);
			if (validationObject.isValidated) {
				User.saveUserDetails(name, email, password, next);
			}
		})
		.catch((validationErrorObject) => {
			return next(new error.UnprocessableEntityError(validationErrorObject.errorMessage));
		});
}

export function logIn(req, res, next) {
	let email = _.trim(req.body.email),
		password = _.trim(req.body.password);
	logInValidation(email, password, next)
		.then((validationObject) => {
			if (validationObject.isValidated) {
				console.log(`Log inValidation..: ${JSON.stringify(validationObject)}`);
				User.saveLogIntoken(email, next);
			}
		})
		.catch((validationErrorObject) => {
			return next(new error.UnprocessableEntityError(validationErrorObject.errorMessage));
		});
}

export function logOut(req, res, next) {
	console.log("LOGOUT headers...", req.headers);
	let email = _.trim(req.headers['x-user-email']);
	let token = _.trim(req.headers['x-user-token']);
	console.log("LOGOUT....", email, token);
	logOutValidation(email, token, next)
		.then((validationObject) => {
			if (validationObject.isValidated) {
				console.log(`Log out  inValidation..: ${JSON.stringify(validationObject)}`);
				User.logOut(email, token, next);
			}
		})
		.catch((validationErrorObject) => {
			return next(new error.UnprocessableEntityError(validationErrorObject.errorMessage));
		});
}

export function resetPassword(req, res, next) {
	let email = _.trim(req.body.email);
	resetPasswordValidation(email, next)
		.then((validationObject) => {
			if (validationObject.isValidated) {
				User.saveResetPasswordToken(email, next);
			}
		})
		.catch((validationObject) => {
			return next(new error.UnprocessableEntityError(validationObject.errorMessage));
		});
}

export function updatePassword(req, res, next) {
	let { email, resetToken } = req.query;
	let { updatedPassword } = req.body;
	console.log("Updated password...",email, resetToken, updatedPassword);
	updatePasswordValidation(email, resetToken, updatedPassword, next)
		.then((validationObject) => {
			if (validationObject.isValidated) {
				User.updatePassword(email, updatedPassword, next);
			}
		})
		.catch((validationObject) => {
			return next(new error.UnprocessableEntityError(validationObject.errorMessage));
		});
}