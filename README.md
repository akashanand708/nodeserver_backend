# nodeserver-backend-boilerplate

> Boilerplate for API Server written in Node.js and ES6.

## Requirements

## API exposed
> /register         -For signUp.
> /login            -For logIn.
> /logout           -For logOut.
> /resetPassword    -For reset password.


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
