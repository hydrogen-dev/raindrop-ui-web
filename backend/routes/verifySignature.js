var express = require('express');
var router = express.Router();

// verifies signatures from internal users that have a registered hydro username
router.post('/', async function(req, res, next) {
  let message = req.body.message;
  let internalUsername = req.body.internalUsername;

  // get the user's information from the hydro2FA database
  let userInformation = await new Promise((resolve,reject) => {
    req.app.get('db').get("SELECT * FROM hydro2FA WHERE internalUsername = ?", [internalUsername], (error, result) => {
      if (error) {
        console.log(error)
        res.json({verified: false})
      } else {
        resolve(result)
      }
    })
  })

  // return false if the database doesn't contain a mapping of internal username to hydro username
  if (userInformation === undefined) {
    console.log("User does not have a Hydro username associated with their account.");
    res.json({verified: false})
  }

  // else, call the Hydro API
  req.app.get('ClientRaindropPartner').verifySignature(userInformation.hydroUsername, message)
  .then(async (result) => {
    if (!result.verified) {
      console.log("User did not sign the correct message.");
      res.json({verified: false})
    } else {
      // if this was the first time the user verified a message, record it in the database
      if (userInformation.confirmed == 0) {
        await new Promise((resolve,reject) => {
          req.app.get('db').run("UPDATE hydro2FA SET confirmed = 1 WHERE internalUsername = ?", [internalUsername], (error) => {
            if (error) {
              console.log(error)
              reject()
            } else {
              resolve()
            }
          })
        })
      }
      res.json({verified: true})
    }
  })
  .catch((error) => {
    console.log(error)
    res.json({verified: false})
  })
});

module.exports = router;
