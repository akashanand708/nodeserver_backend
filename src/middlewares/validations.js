import { fetchUserByEmail } from '../models/User.js';
import ERROR_MESSAGE from '../constants/error-message.js';
import * as User from '../models/User.js';
import { isEmailValid, verifyTokenToken, comparePassword } from '../utilityMethods.js/common.js';
import { prisma } from '../../prisma/generated/prisma-client/index.js';

export async function signUpValidation(name, email, password) {
	let returnedObject = {};
	if (!name) {
		returnedObject = { isValidated: false, errorMessage: ERROR_MESSAGE.NAME_EMPTY };
		return Promise.reject(returnedObject);
	} else if (!email) {
		returnedObject = { isValidated: false, errorMessage: ERROR_MESSAGE.EMAIL_EMPTY };
		return Promise.reject(returnedObject);
	} else if (!password) {
		returnedObject = { isValidated: false, errorMessage: ERROR_MESSAGE.PASSWORD_EMPTY };
		return Promise.reject(returnedObject);
	};

	if (email && isEmailValid(email)) {
		try {
			let user = await prisma.user({ email });
			console.log(`Query new user: ${JSON.stringify(user)}`)
			if (user === null) {
				returnedObject = { isValidated: true, errorMessage: '' };
				return Promise.resolve(returnedObject);
			} else {
				returnedObject = { isValidated: false, errorMessage: ERROR_MESSAGE.USER_ALREADY_EXIST };
				return Promise.reject(returnedObject);
			}
		} catch (error) {
			console.log('SignUp error...', error);
			returnedObject = { isValidated: false, errorMessage: ERROR_MESSAGE.SOMETING_WENT_WRONG };
			return Promise.reject(returnedObject);
		}
	} else {
		returnedObject = { isValidated: false, errorMessage: ERROR_MESSAGE.EMAIL_INCORRECT };
		return Promise.reject(returnedObject);
	}
}

export async function logInValidation(email, password) {
	let returnedObject = {};
	if (!email) {
		returnedObject = { isValidated: false, errorMessage: ERROR_MESSAGE.EMAIL_EMPTY };
		return Promise.reject(returnedObject);
	} else if (!password) {
		returnedObject = { isValidated: false, errorMessage: ERROR_MESSAGE.PASSWORD_EMPTY };
		return Promise.reject(returnedObject);
	}

	if (email && isEmailValid(email)) {
		try {
			let user = await prisma.user({ email });
			console.log(`Query new user: ${JSON.stringify(user)}`)
			if (user === null) {
				returnedObject = { isValidated: false, errorMessage: ERROR_MESSAGE.USER_DOES_NOT_EXIST };
				return Promise.reject(returnedObject);
			} else {
				if (!comparePassword(password, user.password)) {
					returnedObject = { isValidated: false, errorMessage: ERROR_MESSAGE.INVALID_PASSWORD };
					return Promise.reject(returnedObject);
				} else {
					returnedObject = { isValidated: true, errorMessage: '' };
					return Promise.resolve(returnedObject);
				}
			}
		} catch (error) {
			console.log("LogIn error...", error);
			returnedObject = { isValidated: false, errorMessage: ERROR_MESSAGE.SOMETING_WENT_WRONG };
			return Promise.reject(returnedObject);
		}
	} else {
		returnedObject = { isValidated: false, errorMessage: ERROR_MESSAGE.EMAIL_INCORRECT };
		return Promise.reject(returnedObject);
	}
}

export async function logOutValidation(email, token) {
	let returnedObject = {};
	if (!email) {
		returnedObject = { isValidated: false, errorMessage: ERROR_MESSAGE.NO_EMAIL_IN_HEADER };
		return Promise.reject(returnedObject);
	} else if (!token) {
		returnedObject = { isValidated: false, errorMessage: ERROR_MESSAGE.NO_TOKEN_IN_HEADER };
		return Promise.reject(returnedObject);
	}

	if (email && isEmailValid(email)) {
		try {
			await verifyTokenToken(token, email);
			returnedObject = { isValidated: true, errorMessage: '' };
			return Promise.resolve(returnedObject);
		} catch (error) {
			console.log('Log out error...', error);
			returnedObject = { isValidated: false, errorMessage: ERROR_MESSAGE.AUTHENTICATION_FAILED };
			return Promise.reject(returnedObject);
		}
	} else {
		returnedObject = { isValidated: false, errorMessage: ERROR_MESSAGE.EMAIL_INCORRECT };
		return Promise.reject(returnedObject);
	}
}

export async function resetPasswordValidation(email) {
	let returnedObject = {};
	if (!email) {
		returnedObject = { isValidated: false, errorMessage: ERROR_MESSAGE.EMAIL_EMPTY };
		return Promise.reject(returnedObject);
	}
	if (isEmailValid(email)) {
		try {
			let user = await prisma.user({ email });
			console.log(`Query new user: ${JSON.stringify(user)}`)
			if (user === null) {
				returnedObject = { isValidated: false, errorMessage: ERROR_MESSAGE.USER_DOES_NOT_EXIST };
				return Promise.reject(returnedObject);
			} else {
				returnedObject = { isValidated: true, errorMessage: '' };
				return Promise.resolve(returnedObject);
			}
		} catch (error) {
			console.log("LogIn error...", error);
			returnedObject = { isValidated: false, errorMessage: ERROR_MESSAGE.SOMETING_WENT_WRONG };
			return Promise.reject(returnedObject);
		}
	} else {
		returnedObject = { isValidated: false, errorMessage: ERROR_MESSAGE.EMAIL_INCORRECT };
		return Promise.reject(returnedObject);
	}
}

export async function updatePasswordValidation(email, resetPasswordToken, updatedPassword) {
	let returnedObject = {};
	if (!email) {
		returnedObject = { isValidated: false, errorMessage: ERROR_MESSAGE.EMAIL_EMPTY };
		return Promise.reject(returnedObject);
	}
	if (!updatedPassword) {
		returnedObject = { isValidated: false, errorMessage: ERROR_MESSAGE.PASSWORD_EMPTY };
		return Promise.reject(returnedObject);
	}
	if (isEmailValid(email)) {
		try {
			let user = await prisma.user({ email });
			console.log(`Query new user: ${JSON.stringify(user)}`)
			if (user === null) {
				returnedObject = { isValidated: false, errorMessage: ERROR_MESSAGE.USER_DOES_NOT_EXIST };
				return Promise.reject(returnedObject);
			} else {
				//Verify Token expiration.
				if (user.reset_password_token === null && (user.reset_password_token !== resetPasswordToken)) {
					returnedObject = { isValidated: false, errorMessage: ERROR_MESSAGE.UPDATE_PASSWORD_TOKEN_EXPIRED };
					return Promise.reject(returnedObject);
				} else {
					try {
						await verifyTokenToken(resetPasswordToken, email);
						returnedObject = { isValidated: true, errorMessage: '' };
						return Promise.resolve(returnedObject);
					} catch (error) {
						console.log('Update Password error...', error);
						let errorMessage = ERROR_MESSAGE.INVALID_UPDATED_TOKEN;
						if (error.err.name === 'TokenExpiredError') {
							errorMessage = ERROR_MESSAGE.UPDATE_PASSWORD_TOKEN_EXPIRED;
						}
						await User.updateResetPasswordToken(email);
						returnedObject = { isValidated: false, errorMessage: errorMessage };
						return Promise.reject(returnedObject);
					}
				}
			}
		} catch (error) {
			console.log("LogIn error...", error);
			returnedObject = { isValidated: false, errorMessage: ERROR_MESSAGE.SOMETING_WENT_WRONG };
			return Promise.reject(returnedObject);
		}
	} else {
		returnedObject = { isValidated: false, errorMessage: ERROR_MESSAGE.EMAIL_INCORRECT };
		return Promise.reject(returnedObject);
	}
}