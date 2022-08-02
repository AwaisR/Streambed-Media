# streambed-app

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
Frontend is build using React JS, bootstrap on frontend and Node, express, mongodb on backend.

# Environments

prod-live branch is deployed https://app.streambedmedia.com/
staging branch is deployed https://test.streambedmedia.com/

# Architecture

## consumer-app

- bootstrap
- reactjs
- redux

## magnify-app

- bootstrap
- reactjs
- redux

## backend

- expressjs
- mongodb
- nodemailer
- socket.io
- social integrations
  - linkedin api
  - twitter api
  - facebook api
  - instagram api
  - youtube api
  - zoom api
- blockchain integrations
  - flo
  - open index protocol
  - sia skynet
  - ipfs (depreciated)

# Local Installation

1. Confirm that the node version is being set correctly for `consumer-app`, `magnify-app` and `backend`, as per the `.nvmrc` files.

2. If not, in the errant folder, run:

#### `nvm use`

## Backend

### Database

1. To run the project locally you've to install the mongoDB on your local machine and start the mongo server

Follow the up to date instructions here to install mongodb locally on a mac:
https://zellwk.com/blog/install-mongodb/

2. Then to run use

#### `brew services run mongodb-community`

### Server

1. cd to the `backend` directory:

2. Make a file called `.env`, and insert the contents given to you by another developer

3. Make a file called `oauthTwo.keys.json`, and insert the contents given to you by another developer

4. Run the following to install:

#### `npm install`

#### `npm run dev`

Runs the node-app in the development mode.
[http://localhost:4000](http://localhost:4000)

## consumer-app

1. cd to the `consumer-app` directory:

2. Make a file called `.env`, and insert the contents given to you by another developer

3. Run the following to install:

#### `npm install`
#### `npm run dev`

Runs the react-app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## magnify-app

1. cd to the `magnify-app` directory:

2. Make a file called `.env`, and insert the contents given to you by another developer

3. Run the following to install:

#### `npm install`

#### `npm run dev`

Runs the react-app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
