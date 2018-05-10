var express = require('express');
var router = express.Router();

/* GET getDatabase. */
router.get('/', function(req, res, next) {
  // get the user's information from the hydro2FA database
  req.app.get('db').all("SELECT * FROM hydro2FA", [], (error, rows) => {
    if (error) {
      console.log(error)
    }
    res.json(rows ? rows : [{}])
  });
});

module.exports = router;
