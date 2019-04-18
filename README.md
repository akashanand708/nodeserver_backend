# NODESEVER-BACKEND-BOILERPLATE

> A complete initial boilerplate for any WEB and MOBILE application to provide REST APIs, written in Node.js and ES6.

# Key features
## 1. API exposed
- /api/v1/register         -For signUp.
- /api/v1/login            -For logIn.
- /api/v1/logout           -For logOut.
- /api/v1/resetPassword    -For reset password.
- /api/v1/updatePassword   -For update password.

## 2. Introduced Prisma which support MySQL, PostgreSQL, MongoDB.

## 3. Proper error handling.

## 4. Nodemailer implemented for Reset Password.

## 5.For encryption/decryption, methods have been written in CRYPT.JS

## 6.All APIs can be seen in SWAGGER DOCS on http://localhost:5001/api-docs/

# Swagger configuration
- After starting the server in development mode swagger can be run with this url.
  http://localhost:5001/api-docs/

- After adding any new API, need to update SWAGGER.js for that API.


# Requirements
To start any WEB or MOBILE application, we need complete package of REST APIs
like signup/login/logout/resetPassword/UpdatePassword.
This boilerplate can be used.

# Dependencies

- Watcher and hot-reload: [nodemon](http://nodemon.io/)
- Build: [babel](http://babeljs.io/)
    + tools: babel-cli, babel-core
    + presets: babel-preset-es2015-node6, babel-preset-stage-3
- Deployment: [PM2](https://github.com/Unitech/pm2)
- Tech Stack: 

# Logger implemented
# Build Setup

``` bash 
# install dependencies
npm install

# run for development with hot reload at localhost:5001
npm start

# build for production
npm run build

# run for production.
npm run serve

# run for test
npm run test
```

# Mailer service configuration
- Copy env file to .env
- Write necessary mailer service information.

# To connect to database, need to start prisma server.Below is the prisma configuration

# Prisma configuration
``` bash
# Install the Prisma CLI
brew install prisma

# Install Docker
To use Prisma locally, you need to have Docker installed on your machine. If you don\'t have Docker yet, you can download the Docker Community Edition for your operating system here.
https://www.docker.com/products/docker-engine

```

## 1. Prisma setup for new data-base
### 1. Make new folder
``` bash
# Set up and connect Prisma with a database
mkdir hello-world
cd hello-world

# Create Docker Compose file
To launch Prisma on your machine, you need a Docker Compose file that configures Prisma and specifies the database it can connect to.
touch docker-compose.yml

# Add Prisma and database Docker images
Paste the following contents into the Docker Compose file you just created: for MongoDB

version: '3'
services:
  prisma:
    image: prismagraphql/prisma:1.30
    restart: always
    ports:
    - "4466:4466"
    environment:
      PRISMA_CONFIG: |
        port: 4466
        databases:
          default:
            connector: mongo
            uri: mongodb://prisma:prisma@mongo
  mongo:
    image: mongo:3.6
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: prisma
      MONGO_INITDB_ROOT_PASSWORD: prisma
    ports:
      - "27017:27017"
    volumes:
      - mongo:/var/lib/mongo
volumes:
  mongo:

# Launch Prisma and the connected database
docker-compose up -d

```

### 2. Configure your Prisma API
To bootstrap the configuration files for your Prisma client run the following command:
prisma init --endpoint http://localhost:4466
The endpoint needs to match the URL of a running Prisma server.

### 3. Deploy the Prisma datamodel
The prisma init command created the minimal setup needed to deploy the Prisma datamodel: prisma.yml and datamodel.prisma.
prisma deploy

### 4. View and edit your data in Prisma Admin
If you want to view and edit the data in your database, you can use Prisma Admin. To access Prisma Admin, you need to append /_admin to your Prisma endpoint, for example: http://localhost:4466/_admin.

### 5. Generate your Prisma client
The Prisma client is a custom, auto-generated library that connects to your Prisma API. Append the following lines to the end of your prisma.yml:
prisma generate

## 2. Prisma setup for existing data-base
### 1. https://www.prisma.io/docs/get-started/01-setting-up-prisma-existing-database-JAVASCRIPT-a003/
``` bash
prisma init hello-world
```
1. This launches an interactive wizard. Here\'s what you need to do:
2. Select Use existing database
3. Select your database, either PostgreSQL or MongoDB
4. Provide the connection details for your database (see below for more info)
5. Select the Prisma JavaScript client

### 2. Launch Prisma
``` bash
cd hello-world
docker-compose up -d
```

### 3. Deploy the Prisma datamodel
prisma deploy


## 3. Process when you need to update databasemodel.prisma
1. Update databasemodel.prisma
2. docker-compose up -d (Start server if not started)
3. prisma deploy
4. prisma generate (To generate prisma client plug in) 