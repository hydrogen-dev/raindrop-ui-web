const path = require("path")
const sqlite3 = require('sqlite3')

var express = require('express');
var router = express.Router();

/* POST registerUser. */
router.post('/', async function(req, res, next) {
  let hydroUsername = req.body.hydroUsername;
  let internalUsername = req.body.internalUsername;

  req.app.get('ClientRaindropPartner').registerUser(hydroUsername)
    .then(result => {
      // if the API call to register the user was successful and the user doesn't already exist in your database, save
      req.app.get('db').get("SELECT * FROM hydro2FA WHERE internalUsername = ?", [ internalUsername ], (error, userInformation) => {
        if (userInformation === undefined) {
          req.app.get('db').run("INSERT INTO hydro2FA (internalUsername, hydroUsername, confirmed) VALUES (?, ?, ?)",
            [internalUsername, hydroUsername, false], (error) => {
              if (error) {
                console.log(error)
              }
              res.json({registered: true})
            })
        } else {
          // don't allow duplicate internal usernames
          console.log("internal username already exists in the database")
          res.json({registered: false})
        }
      })
    })
    .catch(error => {
      // Log and deal with errors here
      console.log(error)
      res.json({registered: false})
    })
});

module.exports = router;
