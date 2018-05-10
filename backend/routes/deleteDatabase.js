var express = require('express');
var router = express.Router();

/* GET getDatabase. */
router.delete('/', function(req, res, next) {
  // get the user's information from the hydro2FA database
  req.app.get('db').run("DELETE FROM hydro2FA", [], (error) => {
    if (error) {
      console.log(error)
    } else {
      res.sendStatus(200)
    }
  });
});

module.exports = router;
