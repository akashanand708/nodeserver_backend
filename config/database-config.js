export default {
	development: {
		host: 'localhost',
		user: 'root',
		password: 'Akash@28',
		database: 'book_finder',
		port: 3306,
		max: 10, //set pool max size to 20
		min: 2, //set min pool size to 4
		//idleTimeoutMillis: 5000 //close idle clients after 5 second
		domain: 'localhost',
		domainPort: '5001'
	},
	production: {
		host: 'localhost',
		user: 'root',
		password: 'Akash@28',
		database: 'user',
		//port: 5432,
		max: 10, //set pool max size to 20
		min: 2, //set min pool size to 4
		//idleTimeoutMillis: 5000 //close idle clients after 5 second
		domain:''//Production server address
	}
};