var express = require('express');
var router = express.Router();

// verifies signatures from internal users that have a registered hydro username
router.post('/', async function(req, res, next) {
  let message = req.session.message; // get the message from the session
  console.log(`Verifying the following code: '${message}'`)
  // WARNING: THE FOLLOWING LINE IS NOT PRODUCTION-SAFE.
  // Backend logic should not trust data passed in from a front-end. Rely on server-side sessions instead.
  let internalUsername = req.body.internalUsername;

  // get the user's information from the hydro2FA database
  let userInformation = await new Promise((resolve,reject) => {
    req.app.get('db').get("SELECT * FROM hydro2FA WHERE internalUsername = ?", [internalUsername], (error, result) => {
      if (error) {
        console.log(error)
        resolve()
      } else {
        resolve(result)
      }
    })
  })

  // return false if the database doesn't contain a mapping of internal username to hydro username
  if (!userInformation) {
    console.log("User does not have a Hydro username associated with their account.");
    res.sendStatus(404)
    return
  }

  // if it does, call the Hydro API with the message and the hydroID
  req.app.get('ClientRaindropPartner').verifySignature(userInformation.hydroID, message)
  .then(async result => {
    if (!result.verified) {
      console.log("User did not sign the correct message.");
      res.json({verified: false})
      return
    }

    // if this was the first time the user verified a message, record it in the database
    if (userInformation.confirmed == 0) {
      let saved = await new Promise((resolve, reject) => {
        req.app.get('db').run(
          "UPDATE hydro2FA SET confirmed = 1 WHERE internalUsername = ?", [internalUsername], (error) => {
          if (error) {
            console.log(error)
            resolve(false)
          } else {
            resolve(true)
          }
        })
      })
      if (!saved) {
        console.log("User was authenticated with the Hydro API, but they could not be saved in the database")
        res.json({verified: false})
        return
      }
    }

    res.json({verified: true})
  })
  .catch((error) => {
    console.log(error)
    res.json({verified: false})
  })
});

module.exports = router;
