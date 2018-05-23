# nodeserver-backend-boilerplate

> A complete initial boilerplate for API Server written in Node.js and ES6.

## Key feature
1. 
# API exposed
> /api/v1/register         -For signUp.
> /api/v1/login            -For logIn.
> /api/v1/logout           -For logOut.
> /api/v1/resetPassword    -For reset password.
> /api/v1/updatePassword   -For update password.

2. 
# Proper error handling.

3. 
# nodemailer implemented for Reset Password.

4. 
# For encryption/decryption, methods have been written in CRYPT.JS

5. 
# All APIs can be seen in SWAGGER DOCS on http://localhost:5001/api-docs/

# swagger configuration
- After starting the server in development mode swagger can be run with this url.
  http://localhost:5001/api-docs/

- After adding any new API, need to update SWAGGER.js for that API.

# nodemailer configuration
- To configure email service, need to update CONSTANT.JS.
- In CONSTANT.js, encrypted password should be used.For encryption/decryption, methods have been written in      CRYPT.JS

## Requirements
To start any WEB or MOBILE application, we need complete package of REST APIs
like signup/login/logout/resetPassword/UpdatePassword.
This boilerplate can be used.

## Dependencies

- Watcher and hot-reload: [nodemon](http://nodemon.io/)
- Build: [babel](http://babeljs.io/)
    + tools: babel-cli, babel-core
    + presets: babel-preset-es2015-node6, babel-preset-stage-3
- Deployment: [PM2](https://github.com/Unitech/pm2)
- Tech Stack: 


## Build Setup

``` bash 
# install dependencies
npm install

# run for development with hot reload at localhost:3000
npm start

# build for production
npm run build

# run for production.
npm run serve
```
## License
