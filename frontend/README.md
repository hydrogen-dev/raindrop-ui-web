# Frontend

## Getting started
The frontend was generated with [create-react-app](https://github.com/facebook/create-react-app). It's a dynamic webpage that integrates with the backend through the backend's public-facing API. It also receives data from the Hydro API via the backend (the frontend cannot communicate directly with the Hydro API because it cannot store credentials without exposing them to the internet). All logic is contained in [src/App.js](./src/App.js).

## Setup
- `npm install`
- `npm start`

The frontend should now be live on [port 3000]((http://localhost:3000/)). If something goes wrong, please open a Github issue or submit a PR.

## Code
The logic is contained in [src/App.js](./src/App.js).

## Copyright & License
Copyright 2018 The Hydrogen Technology Corporation under the MIT License.
