# Client-Side Raindrop UI - Web

This UI demo is an example implementation of the Client-Side Raindrop Authentication protocol. The logic is divided into [backend/](./backend) and [frontend/](./frontend) components. Please visit each respective folder for setup instructions.

## Introduction
Once your demo is live, you can begin testing out the system! Before diving into explanations, though, let's define some key terms:

-Backend: A privileged server running code. It can receive and send data to/from the *frontend*. The method of communication is the *backend's* internal API.
-Database: The database, only accessible to code running on the backend, must store, at minimum, 3 columns: internalUsername, hydroUsername, confirmed. This codifies the following relationship: users of your site can link their account (identified by internalUsername i.e. a UUID), with their hydroUsername (the UUID that users authenticate themselves with Client Raindrop), and this relationship begins as unconfirmed (when they first enter their hydroUsername is first entered)
-Blockchain: Client Raindrop relies on information being stored in the blockchain. The *Hydro API* manages all interactions with the blockchain, so you can be.
-Frontend
-Raindrop SDK: A Javascript wrapper for making raindrop-related calls to the Hydro API. Abstracts away from a lot of the trivialities of making API calls.
-Hydro API: The API that powers Client-Side Raindrop. The *backend* makes calls to the Hydro API, authenticated with your secret credentials.


## Copyright & License
Copyright 2018 The Hydrogen Technology Corporation under the MIT License.
