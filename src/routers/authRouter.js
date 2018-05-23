import * as authController from '../controllers/authController.js';

export default (router) => {
	router.post('/register', authController.signUp);
	router.patch('/login', authController.logIn);
	router.delete('/logout', authController.logOut);
	router.patch('/resetPassword', authController.resetPassword);
	router.patch('/updatePassword', authController.updatePassword);

 


	//Other routes here
	router.get('*', function (req, res, next) {
		console.log('Response.....', res);
		//res.send('Sorry, this is an invalid URL.404 not found.');
		//console.log("Response.....",res);
		next();
	});
};