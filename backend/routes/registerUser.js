var express = require('express');
var router = express.Router();

// registers an internal user if the Hydro API call with their claimed username succeeds, records it in the database
router.post('/', async function(req, res, next) {
  let hydroUsername = req.body.hydroUsername;
  let internalUsername = req.body.internalUsername;

  // fail if the internal user already has a linked hydro username
  let canRegister = await new Promise((resolve, reject) => {
    req.app.get('db').get(
      "SELECT * FROM hydro2FA WHERE internalUsername = ?", [ internalUsername ], (error, userInformation) => {
      if (userInformation !== undefined) {
        console.log("internal username already exists in the database")
        reject()
      } else {
        resolve(true)
      }
    })
  });

  if (!canRegister) {
    res.json({registered: false})
    return
  }

  // call the Hydro API with the internal user's claimed Hydro username
  req.app.get('ClientRaindropPartner').registerUser(hydroUsername)
    // if the API call to register the user was successful, save it in the database
    .then(result => {
      req.app.get('db').run(
        "INSERT INTO hydro2FA (internalUsername, hydroUsername, confirmed) VALUES (?, ?, ?)",
        [internalUsername, hydroUsername, false], (error) => {
          if (error) {
            console.log(error)
            res.sendStatus(404)
          } else {
            res.json({registered: true})
          }
      })
    })
    .catch(error => {
      console.log(error)
      res.json({registered: false})
    })
});

module.exports = router;
