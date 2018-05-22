export default (req,res,next) => {
	console.log('A request for things received at ' + Date.now());
	next();
};