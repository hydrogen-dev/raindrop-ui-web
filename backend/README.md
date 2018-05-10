# Backend

## Getting started
This example backend runs on [express-generator](https://expressjs.com/en/starter/generator.html). It's a simple API that receives/serves data from/to the frontend. Initialization logic is found in `app.js`, and internal endpoints are defined in `routes/`. This backend is privileged, meaning that some of its public endpoints trigger calls to the Hydro API which are authenticated with client secrets. These secrets, which **must not be exposed in the frontend**, are stored in a `.env` file (see the Setup section for details).

The backend also integrates with a basic sqlite database in `database/`. This database is created automatically when the backend is initialized, and is accessed via API calls from the frontend.

## Setup
First, inform the backend of your secret Hydro API credentials. Open `.env.example`, update it with the appropriate values per the [Raindrop SDK](https://github.com/hydrogen-dev/raindrop-sdk-js), and rename it to `.env`. This ensures that your backend can appropriately authenticate with the Hydro API.

Next:
- `npm install`
- `npm start`

The backend should now be listening on port 3001. You should see `Database initialized.` and `Hydro API initialized.` messages. If so, continue to frontend setup. If not, something went wrong, please open a Github issue or submit a PR.

Note: If you need to use another port, edit the `start` command in `backend/package.json`, and update the `proxy` entry in `frontend/package.json`.


## Copyright & License
Copyright 2018 The Hydrogen Technology Corporation under the MIT License.
