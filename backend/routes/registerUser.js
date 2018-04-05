const path = require('path')
require('dotenv').config({path: path.resolve(process.cwd(), '..', '.env')});
const raindrop = require('@hydrogenplatform/raindrop')

var express = require('express');
var router = express.Router();

/* POST registerUser. */
router.post('/', function(req, res, next) {
  let userName = req.body.hydroUserName;

  result=true
  if (result) {
    res.json({userExists: true});
  } else {
    res.json({userExists: false});
  }

  // raindrop.registerUser(process.env.HYDRO_USERNAME, process.env.HYDRO_KEY, process.env.HYDRO_APPLICATION_ID, userName)
  //   .then(result => {
  //     if (result) {
  //       res.json({userExists: true});
  //     } else {
  //       res.json({userExists: false});
  //     }
  //   })
  //   .catch(error => { throw error });
});

module.exports = router;
