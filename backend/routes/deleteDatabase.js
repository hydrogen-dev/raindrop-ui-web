var express = require('express');
var router = express.Router();

// deletes the entire database...for demonstration purposes only
router.delete('/', function(req, res, next) {
  req.app.get('db').run("DELETE FROM hydro2FA", [], (error) => {
    if (error) {
      console.log(error)
      res.sendStatus(404)
    } else {
      res.sendStatus(200)
    }
  });
});

module.exports = router;
