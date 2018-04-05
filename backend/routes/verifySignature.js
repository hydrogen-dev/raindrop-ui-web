const path = require('path')
require('dotenv').config({path: path.resolve(process.cwd(), '..', '.env')});
const raindrop = require('@hydrogenplatform/raindrop')

var express = require('express');
var router = express.Router();

/* POST verifySignature. */
router.post('/', function(req, res, next) {
  let message = req.body.message;
  let userName = req.body.userName;
  console.log(message)
  result=true
  if (result) {
    res.json({verified: true});
  } else {
    res.json({verified: false});
  }

  // raindrop.verifySignature(
  //   process.env.HYDRO_USERNAME, process.env.HYDRO_KEY, process.env.HYDRO_APPLICATION_ID, userName, message
  // )
  //   .then(result => {
  //     if (result) {
  //       res.json({verified: true});
  //     } else {
  //       res.json({verified: false});
  //     }
  //   })
  //   .catch(error => { throw error });
});

module.exports = router;
