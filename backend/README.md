# Backend

## Getting started
This example backend runs on [express-generator](https://expressjs.com/en/starter/generator.html). It's a simple API that receives/serves data from/to the frontend. Initialization logic is found in `app.js`, and internal endpoints are defined in `routes/`. This backend is privileged, meaning that some of its public endpoints trigger calls to the Hydro API which are authenticated with client secrets. These secrets, which **must not be exposed in the frontend**, are stored in a `.env` file (see [Setup](#setup) for details).

The backend also integrates with a basic sqlite database in `database/`. This database is created automatically when the backend is initialized, and is accessed via API calls from the frontend.

## Setup
- Open `.env.example`, and enter your Hydro API credentials. `clientId` and `clientSecret` are your OAuth credentials for the Hydro API, an `applicationId` will be assigned to you on the Hydrogen Platform developer portal, and `hydroEnvironment` will be either `Sandbox` or `Production`. For more information, see the [Raindrop SDK](https://github.com/hydrogen-dev/raindrop-sdk-js). When you're finished, rename the file to `.env`.
- `npm install`
- `npm start`

The backend should now be listening on port 3001. You should see the message: `Database initialized.`. If so, continue to frontend setup. If not, something went wrong, please open a Github issue or submit a PR.

Note: If you need to use another port, edit the `start` command in `backend/package.json`, and update the `proxy` entry in `frontend/package.json`.

## Code
Setup logic is contained in [app.js](./app.js). This is where the database and Raindrop SDK are initialized. Individual endpoints of the internal API are defined in [routes/](./routes/). Of these, `deleteDatabase`, `getDatabase`, and `index` exist solely for testing purposes. The others, `isInDatabase`, `registerUser`, `unregisterUser`, and `verifySignature` will likely be implemented in some form by websites integrating Client Raindrop.

## Copyright & License
Copyright 2018 The Hydrogen Technology Corporation under the MIT License.
