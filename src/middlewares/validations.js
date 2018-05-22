import { fetchUserByEmail } from '../models/User.js';
import ERROR_MESSAGE from '../constants/error-message.js';
import * as User from '../models/User.js';
import { isEmailValid, verifyTokenToken, comparePassword } from '../utilityMethods.js/common.js';

export function signUpValidation(name, email, password) {
	return new Promise(function (resolve, reject) {
		//Server side validation.
		if (!name) {
			reject({ isValidated: false, errorMessage: ERROR_MESSAGE.NAME_EMPTY });
		} else if (!email) {
			reject({ isValidated: false, errorMessage: ERROR_MESSAGE.EMAIL_EMPTY });
		} else if (!password) {
			reject({ isValidated: false, errorMessage: ERROR_MESSAGE.PASSWORD_EMPTY });
		}

		//DB validation if user already exist. 
		if (email && isEmailValid(email)) {
			return fetchUserByEmail(email)
				.then((user) => {
					if (user === null) {
						reject({ isValidated: false, errorMessage: ERROR_MESSAGE.SOMETING_WENT_WRONG });
					} else {
						if (user !== undefined) {
							reject({ isValidated: false, errorMessage: ERROR_MESSAGE.USER_ALREADY_EXIST });
						} else {
							resolve({ isValidated: true, errorMessage: '' });
						}
					}
				})
				.catch((error) => {
					console.log('SignUp error...', error);
					reject({ isValidated: false, errorMessage: ERROR_MESSAGE.SOMETING_WENT_WRONG });
				});
		} else {
			reject({ isValidated: false, errorMessage: ERROR_MESSAGE.EMAIL_INCORRECT });
		}
	});
}

export function logInValidation(email, password) {
	return new Promise(function (resolve, reject) {
		//Server side validation.
		if (!email) {
			reject({ isValidated: false, errorMessage: ERROR_MESSAGE.EMAIL_EMPTY });
		} else if (!password) {
			reject({ isValidated: false, errorMessage: ERROR_MESSAGE.PASSWORD_EMPTY });
		}

		//DB validation if user doesn't exist. 
		if (email && isEmailValid(email)) {
			return fetchUserByEmail(email)
				.then((user) => {
					if (user === null) {
						reject({ isValidated: false, errorMessage: ERROR_MESSAGE.SOMETING_WENT_WRONG });
					} else {
						if (user === undefined) {
							reject({ isValidated: false, errorMessage: ERROR_MESSAGE.USER_DOES_NOT_EXIST });
						} else {
							if (!comparePassword(password, user.password)) {
								reject({ isValidated: false, errorMessage: ERROR_MESSAGE.INVALID_PASSWORD });
							}
							resolve({ isValidated: true, errorMessage: '' });
						}
					}
				})
				.catch((error) => {
					console.log("LogIn error...", error);
					if (error.db_error) {
						reject({ isValidated: false, errorMessage: ERROR_MESSAGE.SOMETING_WENT_WRONG });
					}
				});
		} else {
			reject({ isValidated: false, errorMessage: ERROR_MESSAGE.EMAIL_INCORRECT });
		}
	});
}

export function logOutValidation(email, token) {
	return new Promise(function (resolve, reject) {
		if (!email) {
			reject({ isValidated: false, errorMessage: ERROR_MESSAGE.NO_EMAIL_IN_HEADER });
		} else if (!token) {
			reject({ isValidated: false, errorMessage: ERROR_MESSAGE.NO_TOKEN_IN_HEADER });
		}

		if (email && isEmailValid(email)) {
			return verifyTokenToken(token, email)
				.then((value) => {
					resolve({ isValidated: true, errorMessage: '' });
				})
				.catch((error) => {
					console.log('Log out error...', error);
					reject({ isValidated: false, errorMessage: ERROR_MESSAGE.AUTHENTICATION_FAILED });
				});
		} else {
			reject({ isValidated: false, errorMessage: ERROR_MESSAGE.EMAIL_INCORRECT });
		}

	});
}

export function resetPasswordValidation(email) {
	return new Promise(function (resolve, reject) {
		if (!email) {
			reject({ isValidated: false, errorMessage: ERROR_MESSAGE.EMAIL_EMPTY });
		}
		if (isEmailValid(email)) {
			return fetchUserByEmail(email)
				.then((user) => {
					if (user === null) {
						reject({ isValidated: false, errorMessage: ERROR_MESSAGE.SOMETING_WENT_WRONG });
					} else {
						if (user === undefined) {
							reject({ isValidated: false, errorMessage: ERROR_MESSAGE.USER_DOES_NOT_EXIST });
						} else {
							resolve({ isValidated: true, errorMessage: '' });
						}
					}
				})
				.catch((error) => {
					console.log('Reset password error....', error);
					reject({ isValidated: false, errorMessage: ERROR_MESSAGE.SOMETING_WENT_WRONG });
				});
		} else {
			reject({ isValidated: false, errorMessage: ERROR_MESSAGE.EMAIL_INCORRECT });
		}
	});
}

export  function updatePasswordValidation(email, resetPasswordToken,updatedPassword) {
	return new Promise(function (resolve, reject) {
		if (!email) {
			reject({ isValidated: false, errorMessage: ERROR_MESSAGE.EMAIL_EMPTY });
		}
		if(!updatedPassword){
			reject({ isValidated: false, errorMessage: ERROR_MESSAGE.PASSWORD_EMPTY });
		}
		if (isEmailValid(email)) {
			return fetchUserByEmail(email)
				.then((user) => {
					if (user === null) {
						reject({ isValidated: false, errorMessage: ERROR_MESSAGE.SOMETING_WENT_WRONG });
					} else {
						if (user === undefined) {
							reject({ isValidated: false, errorMessage: ERROR_MESSAGE.USER_DOES_NOT_EXIST });
						} else {
							//Verify Token expiration.
							if(user.reset_password_token === null &&  (user.reset_password_token !== resetPasswordToken)){
								reject({isValidated: false, errorMessage: ERROR_MESSAGE.UPDATE_PASSWORD_TOKEN_EXPIRED});
							}
							return verifyTokenToken(resetPasswordToken, email) 
								.then((value) => {
									resolve({ isValidated: true, errorMessage: '' });
								})
								.catch((error) => {
									console.log('Update Password error...', error);
									let errorMessage = ERROR_MESSAGE.INVALID_UPDATED_TOKEN;
									if (error.err.name === 'TokenExpiredError') {
										errorMessage = ERROR_MESSAGE.UPDATE_PASSWORD_TOKEN_EXPIRED;
									}
									User.updateResetPasswordToken(email);
									reject({ isValidated: false, errorMessage: errorMessage });
								});
						}
					}
				})
				.catch((error) => {
					console.log('Reset password error....', error);
					reject({ isValidated: false, errorMessage: ERROR_MESSAGE.SOMETING_WENT_WRONG });
				});
		} else {
			reject({ isValidated: false, errorMessage: ERROR_MESSAGE.EMAIL_INCORRECT });
		}
	});
}