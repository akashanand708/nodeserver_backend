import bcrypt from 'bcryptjs';
import _ from 'lodash';
import jwt from 'jsonwebtoken';
import transporter from './nodemailer';
import { EMAIL_CONFIG } from '../constants/constant';
import backEndServerConfig from '../../config/backend-server-config';

/**
 * Method to encrypt password.
 * @param {*} password 
 */
export const encryptPassword = (password) => {
	let hash = null;
	if (!_.isEmpty(password)) {
		let salt = bcrypt.genSaltSync(10);
		hash = bcrypt.hashSync(password, salt);
	}
	return hash;
};

/**
 * Method to compare password.
 * @param {*} reqPassword 
 * @param {*} dbPassword 
 */
export const comparePassword = (reqPassword, dbPassword) => {
	let isPasswordMathced = false;
	if (reqPassword !== '' && dbPassword !== '') {
		isPasswordMathced = bcrypt.compareSync(reqPassword, dbPassword);
	}
	return isPasswordMathced;
};

/**
 * Method to verify headerToken.
 * @param {*} token 
 */
export const verifyTokenToken = (token, email) => {
	return new Promise(function (resolve, reject) {
		if (token) {
			jwt.verify(token, 'secret', function (err, decoded) {
				if (err) {
					reject({ isTokenVerified: false, err });
				}
				else if (decoded && ((decoded.email).toUpperCase() === email.toUpperCase())) {
					resolve({ isTokenVerified: true, decoded });
				} else {
					reject({ isTokenVerified: false, decoded: null });
				}
			});
		}
		reject({ isTokenVerified: false, decoded: null });
	});
};
/**
 * Method to validate email.
 */
export const isEmailValid = (email) => {
	let status = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim());
	return status;
};


/**
 * method to generate JWT token.
 * @param {*} name 
 * @param {*} email 
 */
export const generateJwtToken = (name, email) => {
	let jwtToken = null;
	if (name && email) {
		jwtToken = jwt.sign({
			name: name,
			email: email
		}, 'secret');
	}
	return jwtToken;
};

/**
 * method to generate JWT token.
 * @param {*} name 
 * @param {*} email 
 */
export const generateJwtTokenForResetPassword = (name, email) => {
	let jwtToken = null;
	if (name && email) {
		jwtToken = jwt.sign({
			name: name,
			email: email
		}, 'secret', { expiresIn: 30 });
	}
	return jwtToken;
};

/**
 * Method to send email.
 * @param {*} emailOptions 
 */
export const sendEmail = (emailOptions) => {
	return new Promise(function (resolve, reject) {
		var mailOptions = {
			from: EMAIL_CONFIG.USER,
			to: emailOptions.to,
			subject: emailOptions.subject,
			html: emailOptions.html
		};

		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
				reject({ emailSent: false });
			} else {
				console.log('Email sent: ' + info.response);
				resolve({ emailSent: true });
			}
		});
	});
};

/**
 * Method to prepare base server url based on development or production mode.
 */
export const prepareBaseUrl = () => {
	let backEndConfig = backEndServerConfig[process.env.NODE_ENV];
	let baseUrl = `${backEndConfig.protocol}://${backEndConfig.host}${backEndConfig.port ? ':' + backEndConfig.port : ''}`;
	return baseUrl;
};