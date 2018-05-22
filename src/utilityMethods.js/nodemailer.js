import nodemailer from 'nodemailer';
import { EMAIL_CONFIG } from '../constants/constant';
import { decrypt } from './crypt';

let transporter = nodemailer.createTransport({
	service: EMAIL_CONFIG.SERVICE,
	auth: {
		user: EMAIL_CONFIG.USER,
		pass:  decrypt(EMAIL_CONFIG.PASSWORD)
	}
});

export default transporter;