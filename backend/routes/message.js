var express = require('express');
var router = express.Router();
var raindrop = require('@hydrogenplatform/raindrop');

/* GET QR code */
router.get('/', function(req, res, next) {
  let message = raindrop.client.generateMessage();
  req.session.message = message;
  res.json({message: message})
});

module.exports = router;
