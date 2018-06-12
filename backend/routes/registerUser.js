var express = require('express');
var router = express.Router();

// registers an internal user if the Hydro API call with their claimed username succeeds, records it in the database
router.post('/', async function(req, res, next) {
  let hydroID = req.body.hydroID;
  // WARNING: THE FOLLOWING LINE IS NOT PRODUCTION-SAFE.
  // Backend logic should not trust data passed in from a front-end. Rely on server-side sessions instead.
  let internalUsername = req.body.internalUsername;

  // fail if the internal user already has a linked hydro username
  let canRegister = await new Promise((resolve, reject) => {
    req.app.get('db').get(
      "SELECT * FROM hydro2FA WHERE internalUsername = ?", [ internalUsername ], (error, userInformation) =>
    {
      if (userInformation !== undefined) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  });
  if (!canRegister) {
    console.log("the internal username is already linked to a hydroID in the database")
    res.sendStatus(404)
    return
  }

  // call the Hydro API with the internal user's claimed HydroID
  req.app.get('ClientRaindropPartner').registerUser(hydroID)
    // if the API call to register the user was successful, save it in the database
    .then(result => {
      req.app.get('db').run(
        "INSERT INTO hydro2FA (internalUsername, hydroID, confirmed) VALUES (?, ?, ?)",
        [internalUsername, hydroID, false], async error =>
      {
          if (error) {
            console.log(error)
            await req.app.get('ClientRaindropPartner').unregisterUser(hydroID) // unregister if there was a DB error
            res.sendStatus(404)
          } else {
            res.json({registered: true})
          }
      })
    })
    .catch(error => {
      console.log(error)
      res.sendStatus(404)
    })
});

module.exports = router;
