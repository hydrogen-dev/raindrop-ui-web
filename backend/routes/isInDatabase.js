const path = require('path')
const sqlite3 = require('sqlite3')

var express = require('express');
var router = express.Router();

/* POST isInDatabase. */
router.post('/', async function(req, res, next) {
  let internalUsername = req.body.internalUsername;

  // get the user's information from the hydro2FA database
  var userInformation
  req.app.get('db').get("SELECT * FROM hydro2FA WHERE internalUsername = ?", internalUsername, (error, userInformation) => {
    // return false if the database doesn't contain a mapping of internal username to hydro username
    if (userInformation === undefined) {
      res.json({exists: false})
    } else {
      res.json({exists: true, username: userInformation.hydroUsername, confirmed: userInformation.confirmed})
    }
  });
});

module.exports = router;
