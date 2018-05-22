# Client-Side Raindrop UI - Web

This UI demo is an example implementation of the Client-Side Raindrop Authentication protocol. The logic is divided into [backend/](./backend) and [frontend/](./frontend) components. Please visit each respective folder for setup instructions.

## Terms
Once your demo is live, you can begin testing out the system! It will be helpful to define some key terms:

- Backend: A privileged server running code. It can receive and send data to/from the `frontend`. The two communicate via the `backend`'s internal API.
- Database: The database, only accessible to code running on the backend, must store, at minimum, 3 columns: `internalUsername`, `hydroUsername`, `confirmed`. This codifies the following relationship: users of your site can link their account (identified by `internalUsername`, a UUID) with their `hydroUsername` (a UUID that users of Client Raindrop pick for themselves). When users first enter their `hydroUsername`, `confirmed := false`, and should only be set to `true` after the first time they successfully sign a message (i.e. after you successfully call the `verifySignature` endpoint of the `Hydro API`).
- Blockchain: Client Raindrop relies on information being stored in the `blockchain`. The `Hydro API` manages all interactions with the blockchain, so you don't have to!
- Frontend: The `frontend` is your client-facing website. Users must be able to opt in to Client Raindrop by providing their `hydroUsername`. They then should be prompted to verify this link via a first-time signature verification. Once the link is confirmed, users should be required to sign a message at every log-in/transaction/etc. that you wish to protect with Client Raindrop.
- Raindrop SDK: A Javascript wrapper for making calls to the `Hydro API`. Abstracts away from a lot of the trivialities of making API calls.
- Hydro API: The API that powers Client-Side Raindrop. The `backend` makes calls to the Hydro API, authenticated with your secret credentials.


## Copyright & License
Copyright 2018 The Hydrogen Technology Corporation under the MIT License.
