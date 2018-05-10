var express = require('express');
var router = express.Router();

// returns the entire database...for demonstration purposes only
router.get('/', function(req, res, next) {
  req.app.get('db').all("SELECT * FROM hydro2FA", [], (error, rows) => {
    if (error) {
      console.log(error)
    }
    res.json(rows ? rows : [{}])
  });
});

module.exports = router;
