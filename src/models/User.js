import connectionPool from '../utilityMethods.js/db.js';
import error from 'restify-errors';
import { encryptPassword, generateJwtToken, sendEmail, generateJwtTokenForResetPassword, prepareBaseUrl } from '../utilityMethods.js/common.js';
import ERROR_MESSAGE from '../constants/error-message.js';
import SUCCESS_MESSAGE from '../constants/success-message.js';


/**
 * Fetch user by Email Id.
 * @param {*} email 
 */
export function fetchUserByEmail(email) {
	return new Promise(function (resolve, reject) {
		if (email) {
			return connectionPool.getConnection((sqlError, connection) => {
				if (sqlError) {
					console.log('fetchUserByEmail get connection SqlError...', sqlError);
					reject({ db_error: true, error: sqlError });
				}
				var sql = `SELECT * FROM USER WHERE email = '${email}'`;
				return connection.query(sql, function (err, result) {
					connection.release();
					if (err) {
						console.log('fetchUserByEmail sqlError...', err);
						reject({ db_error: true, error: err });
					}
					let userData = result[0];
					resolve(userData);
				});
			});
		}
	});
}
/**
 * Save user details and send token.
 * @param {*} name 
 * @param {*} email 
 * @param {*} password 
 * @param {*} next 
 */
export function saveUserDetails(name, email, password, next) {
	connectionPool.getConnection((sqlError, connection) => {
		if (sqlError) {
			console.log('Save userDetails get connection SqlError...', sqlError);
			return next(new error.InternalServerError(ERROR_MESSAGE.SOMETING_WENT_WRONG));
		}
		let sql = 'INSERT INTO USER (name, email,password,jwt_token,reset_password_token) VALUES ?';
		let jwtToken = generateJwtToken(name, email);
		let values = [
			[name, email, encryptPassword(password), jwtToken,null]
		];
		connection.query(sql, [values], function (err, result) {
			connection.release();
			if (err) {
				console.log('Save userDetails sqlError...', err);
				return next(new error.InternalServerError(ERROR_MESSAGE.SOMETING_WENT_WRONG));
			}
			return next({ code: 'success', message: SUCCESS_MESSAGE.SUCCESS, token: jwtToken, email });
		});
	});
}

/**
 * Method to generate logIn token and save it to against a user in DB
 * and return as a response.
 * @param {*} email 
 * @param {*} next 
 */
export function saveLogIntoken(email, next) {
	connectionPool.getConnection((sqlError, connection) => {
		if (sqlError) {
			console.log('Save logIn token get connection SqlError...', sqlError);
			return next(new error.InternalServerError(ERROR_MESSAGE.SOMETING_WENT_WRONG));
		}
		let jwtToken = generateJwtToken('LogIn', email);
		let sql = `UPDATE USER SET jwt_token = '${jwtToken}' WHERE EMAIL='${email}'`;
		connection.query(sql, function (err, result) {
			connection.release();
			if (err) {
				console.log('Save logIn token error...', err);
				return next(new error.InternalServerError(ERROR_MESSAGE.SOMETING_WENT_WRONG));
			}
			return next({ code: 'success', message: SUCCESS_MESSAGE.SUCCESS, token: jwtToken, email });
		});
	});
}

/**
 * Method to update jwt_token to null after logout
 * and send token:null as response.
 * @param {*} email 
 * @param {*} headerToken 
 * @param {*} next 
 */
export function logOut(email, headerToken, next) {
	connectionPool.getConnection((sqlError, connection) => {
		if (sqlError) {
			console.log('Logout get connection SqlError...', sqlError);
			return next(new error.InternalServerError(ERROR_MESSAGE.SOMETING_WENT_WRONG));
		}
		let sql = `UPDATE USER SET jwt_token = null WHERE EMAIL='${email}'`;
		connection.query(sql, function (err, result) {
			connection.release();
			if (err) {
				console.log('LogOut SqlError...', err);
				return next(new error.InternalServerError(ERROR_MESSAGE.SOMETING_WENT_WRONG));
			}
			return next({ code: 'success', message: SUCCESS_MESSAGE.SUCCESS, token: null, email });
		});
	});
}

/**
 * Method to save reset password token for a particular user.
 * @param {*} email 
 * @param {*} next 
 */
export function saveResetPasswordToken(email, next) {
	connectionPool.getConnection((sqlError, connection) => {
		if (sqlError) {
			console.log('Reset Password get connection SqlError...', sqlError);
			return next(new error.InternalServerError(ERROR_MESSAGE.SOMETING_WENT_WRONG));
		}
		let resetPasswordToken = generateJwtTokenForResetPassword('ResetPassword', email);
		let sql = `UPDATE USER SET reset_password_token = '${resetPasswordToken}' WHERE EMAIL='${email}'`;
		console.log("Sql...", sql);
		connection.query(sql, function (err, result) {
			connection.release();
			if (err) {
				console.log('Reset Password SqlError...', err);
				return next(new error.InternalServerError(ERROR_MESSAGE.SOMETING_WENT_WRONG));
			}
			//Send reset password link.
			let backEndServerBaseUrl = prepareBaseUrl();
			let emailOptions = {
				to: email,
				subject: 'test',
				//text: 'Hello'
				html: `<a href=${backEndServerBaseUrl}/resetPassword?email=${email}&resetToken=${resetPasswordToken}>
				http://localhost:5001/resetPassword?email=${email}&resetToken=${resetPasswordToken}</a>`
			};
			sendEmail(emailOptions)
				.then((response) => {
					console.log('Send reset link email.....', response);
					return next({ code: 'success', message: SUCCESS_MESSAGE.RESET_LINK_SENT + email });
				})
				.catch((error) => {
					console.log('Send email error.....', error);
					return next({ code: 'ServiceUnavailable', message: ERROR_MESSAGE.SERVICE_UNAVAILABLE });
				});
		});
	});
}

/**
 * Method to update password for a particular user.
 * @param {*} email
 * @param {*} updatedPassword 
 * @param {*} next 
 */
export function updatePassword(email, updatedPassword, next) {
	connectionPool.getConnection((sqlError, connection) => {
		if (sqlError) {
			console.log('Update Password get connection SqlError...', sqlError);
			return next(new error.InternalServerError(ERROR_MESSAGE.SOMETING_WENT_WRONG));
		}
		let sql = `UPDATE USER SET password = '${encryptPassword(updatedPassword)}', reset_password_token = null WHERE EMAIL='${email}'`;
		console.log("Sql...", sql);
		connection.query(sql, function (err, result) {
			connection.release();
			if (err) {
				console.log('Update Password SqlError...', err);
				return next(new error.InternalServerError(ERROR_MESSAGE.SOMETING_WENT_WRONG));
			}
			return next({ code: 'success', message: SUCCESS_MESSAGE.PASSWORD_UPDATED });
		});
	});
}

/**
 * This method update the reset_password_toekn to null if password has expired.
 * @param {*} email 
 */
export function updateResetPasswordToken(email) {
	connectionPool.getConnection((sqlError, connection) => {
		if (sqlError) {
			console.log('Update Password get connection SqlError...', sqlError);
			return { isReset: false, errorMessage: ERROR_MESSAGE.SOMETING_WENT_WRONG };
		}
		let sql = `UPDATE USER SET reset_password_token = null WHERE EMAIL='${email}'`;
		console.log("Sql...", sql);
		connection.query(sql, function (err, result) {
			connection.release();
			if (err) {
				console.log('Update Password SqlError...', err);
				return { isReset: false, errorMessage: ERROR_MESSAGE.SOMETING_WENT_WRONG };
			}
			return { isReset: true, errorMessage: '' };
		});
	});
}