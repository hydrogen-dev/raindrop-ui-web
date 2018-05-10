# Frontend

## Getting started
This example backend runs on [express-generator](https://expressjs.com/en/starter/generator.html). It's a simple API that receives/serves data from/to the frontend. Initialization logic is found in `app.js`, and internal endpoints are defined in `routes/`. Some of these endpoints trigger calls to the Hydro API. The backend also integrates with a basic sqlite database in `database/`. This database is created automatically when the backend is initialized, and is accessed via API calls the frontend.

The frontend was generated with [create-react-app](https://github.com/facebook/create-react-app). It's a dynamic webpage that integrates with the backend through the backend's public-facing API. It also receives data from the Hydro API via the backend (the frontend cannot communicate directly with the Hydro API because it cannot store credentials without exposing them to the internet).

## Setup
- `npm install`
- `npm start`


The frontend should now be live on [port 3000]((http://localhost:3000/)). If something goes wrong, please open a Github issue or submit a PR.

## Copyright & License
Copyright 2018 The Hydrogen Technology Corporation under the MIT License.
