import { prisma } from '../../prisma/generated/prisma-client';
import error from 'restify-errors';
import { encryptPassword, generateJwtToken, sendEmail, generateJwtTokenForResetPassword, prepareBaseUrl } from '../utilityMethods.js/common.js';
import ERROR_MESSAGE from '../constants/error-message.js';
import SUCCESS_MESSAGE from '../constants/success-message.js';


/**
 * Save user details and send token.
 * @param {*} name 
 * @param {*} email 
 * @param {*} password 
 * @param {*} next 
 */
export async function saveUserDetails(name, email, password, next) {
	try {
		let jwtToken = generateJwtToken(name, email);
		let newUser = await prisma
			.createUser({
				email: email,
				name: name,
				password: encryptPassword(password),
				jwt_token: jwtToken,
				reset_password_token: 'null',
				updated_date: new Date(),
				created_date: new Date()
			});
		console.log(`Created new user: ${JSON.stringify(newUser)}`)
		return next({ code: 'success', message: SUCCESS_MESSAGE.SUCCESS, token: jwtToken, email });
	} catch (error) {
		console.log('Save userDetails sqlError...', error);
		return next(new error.InternalServerError(ERROR_MESSAGE.SOMETING_WENT_WRONG));
	}
}

/**
 * Method to generate logIn token and save it to against a user in DB
 * and return as a response.
 * @param {*} email 
 * @param {*} next 
 */
export async function saveLogIntoken(email, next) {
	try {
		let jwt_token = generateJwtToken('LogIn', email);
		let updatedUser = await prisma.updateUser({
			data: {
				jwt_token,
				updated_date: new Date()
			},
			where: {
				email
			}
		});
		console.log(`Updated user: ${JSON.stringify(updatedUser)}`)
		return next({ code: 'success', message: SUCCESS_MESSAGE.SUCCESS, token: jwt_token, email });
	} catch (error) {
		console.log('Update userDetails sqlError...', error);
		return next(new error.InternalServerError(ERROR_MESSAGE.SOMETING_WENT_WRONG));
	}
}

/**
 * Method to update jwt_token to null after logout
 * and send token:null as response.
 * @param {*} email 
 * @param {*} headerToken 
 * @param {*} next 
 */
export async function logOut(email, headerToken, next) {
	try {
		let user = await prisma.updateUser({
			data: {
				jwt_token: "null",
				updated_date: new Date()
			},
			where: {
				email
			}
		});
		return next({ code: 'success', message: SUCCESS_MESSAGE.SUCCESS, token: null, email });
	} catch (error) {
		console.log('Update userDetails sqlError...', error);
		return next(new error.InternalServerError(ERROR_MESSAGE.SOMETING_WENT_WRONG));
	}
}

/**
 * Method to save reset password token for a particular user.
 * @param {*} email 
 * @param {*} next 
 */
export async function saveResetPasswordToken(email, next) {
	console.log("ENV VARIABLES...", process.env.NODEMAILER_SERVICE, process.env.NODEMAILER_USER, process.env.NODEMAILER_PASS)
	let reset_password_token = generateJwtTokenForResetPassword('ResetPassword', email);
	try {
		let updatedUser = await prisma.updateUser({
			data: { reset_password_token, updated_date: new Date() },
			where: { email }
		});
		if (updatedUser === null) {
			return next(new error.InternalServerError(ERROR_MESSAGE.SOMETING_WENT_WRONG));
		} else {
			let backEndServerBaseUrl = prepareBaseUrl();
			let emailOptions = {
				to: email,
				subject: 'test',
				//text: 'Hello'
				html: `<a href=${backEndServerBaseUrl}/resetPassword?email=${email}&resetToken=${reset_password_token}>
					http://localhost:5001/resetPassword?email=${email}&resetToken=${reset_password_token}</a>`
			};
			try {
				await sendEmail(emailOptions);
				return next({ code: 'success', message: SUCCESS_MESSAGE.RESET_LINK_SENT + email });
			} catch (error) {
				console.log('Send email error.....', error);
				return next({ code: 'ServiceUnavailable', message: ERROR_MESSAGE.SERVICE_UNAVAILABLE });
			}
		}
	} catch (error) {
		console.log('Error save reset password link.....', error);
		return next(new error.InternalServerError(ERROR_MESSAGE.SOMETING_WENT_WRONG));
	}
}

/**
 * Method to update password for a particular user.
 * @param {*} email
 * @param {*} updatedPassword 
 * @param {*} next 
 */
export async function updatePassword(email, updatedPassword, next) {
	try {
		let user = await prisma.updateUser({
			data: {
				password: encryptPassword(updatedPassword),
				reset_password_token: 'null',
				updated_date: new Date()
			},
			where: {
				email
			}
		});
		return next({ code: 'success', message: SUCCESS_MESSAGE.PASSWORD_UPDATED });
	} catch (error) {
		console.log('Update Password SqlError...', err);
		return next(new error.InternalServerError(ERROR_MESSAGE.SOMETING_WENT_WRONG));
	}
}

/**
 * This method update the reset_password_toekn to null if password has expired.
 * @param {*} email 
 */
export async function updateResetPasswordToken(email) {
	try {
		let user = await prisma.updateUser({
			data: {
				reset_password_token: "null",
				updated_date: new Date()
			},
			where: {
				email
			}
		});
		return { isReset: true, errorMessage: '' };
	} catch (error) {
		console.log('Update Password SqlError...', err);
		return { isReset: false, errorMessage: ERROR_MESSAGE.SOMETING_WENT_WRONG };
	}
}