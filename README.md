# Raindrop Client UI for Web

This UI demo is an example implementation of the Raindrop Client Authentication protocol. The logic is divided into [backend/](./backend) and [frontend/](./frontend) components.

## Getting started
The example backend runs on [express-generator](https://expressjs.com/en/starter/generator.html), while the frontend was generated with [create-react-app](https://github.com/facebook/create-react-app) skeleton code. After cloning the repository:

### Setting up the Backend
- `cd backend`
- `npm install`
- Listen on port 3001: `PORT=3001 node ./bin/www` (make sure to update the `proxy` entry in `frontend/package.json` if you choose to use another port)

### Setting up the Frontend
In another terminal:
- `cd frontend`
- `npm install`
- `npm start`

The demo should now be live at [http://localhost:3000/](http://localhost:3000/).

## Copyright & License
Copyright 2018 The Hydrogen Technology Corporation under the GNU General Public License v3.0.
