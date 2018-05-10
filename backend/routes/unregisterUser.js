const path = require("path")
const sqlite3 = require('sqlite3')

var express = require('express');
var router = express.Router();

/* POST registerUser. */
router.post('/', async function(req, res, next) {
  let hydroUsername = req.body.hydroUsername;

  req.app.get('ClientRaindropPartner').unregisterUser(hydroUsername)
    .then(result => {
      // if the API call to unregister was successful, delete it in your database
      var db = new sqlite3.Database(path.join(__dirname, '..', 'database', 'myDatabase.sqlite'));
      db.run("DELETE FROM hydro2FA WHERE hydroUsername = ?", [ hydroUsername ]);
      db.close()
      res.json({unregistered: true})
    })
    .catch(error => {
      // Log and deal with errors here
      console.log(error)
      throw error
    });
});

module.exports = router;
