# Backend

## Getting started
This example backend runs on [express-generator](https://expressjs.com/en/starter/generator.html). It's a simple API that receives/serves data from/to the frontend. Initialization logic is found in `app.js`, and internal endpoints are defined in `routes/`. This backend is privileged, meaning that some of its public endpoints trigger calls to the Hydro API which are authenticated with secret credentials. These secrets, which **must not be exposed in the frontend**, are stored in a `.env` file (see [Setup](#setup) for details).

The backend also integrates with a basic sqlite database in `database/`. This database is created automatically when the backend is initialized, and is accessed via API calls from the frontend.

## Setup
- Make a copy of `.env.example`, rename it to `.env`, and fill in the fields as appropriate. `clientId` and `clientSecret` are your OAuth credentials for the Hydro API, you may request an `applicationId` on the Hydrogen Platform developer portal, and `hydroEnvironment` will remain as `Sandbox`. For more information on these parameters, see the [Raindrop SDK](https://github.com/hydrogen-dev/raindrop-sdk-js).
- `npm install`
- `npm start`

The backend should now be listening on port 3001. You should see initialization messages for the database and the Javascript SDK for the Hydro API. If this worked, continue to frontend setup. If not, something went wrong, please open a Github issue or submit a PR.

Note: If you need to use another port, edit the `start` command in `backend/package.json`, and update the `proxy` entry in `frontend/package.json`.

## Code
Setup logic is contained in [app.js](./app.js). This is where the database and Raindrop SDK are initialized. Individual endpoints of the internal API are defined in [routes/](./routes/).

Briefly, these endpoints are defined as follows:
- `getDatabase`: returns the contents of the backend database to the frontend. Exists solely for testing purposes.
- `message`: generates a message for the user to sign and stores it in a secure session.
- `registerUser`: registers an internal user's claimed HydroID with the Hydro API and logs this in the internal DB.
- `unregisterUser`: unregisters an internal user's linked HydroID with the Hydro API and logs this in the internal DB.
- `verifySignature`: verifies whether internal users have authenticated with the Hydro API using their linked HydroID.

## Copyright & License
Copyright 2018 The Hydrogen Technology Corporation under the MIT License.
