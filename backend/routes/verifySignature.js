const raindrop = require('@hydrogenplatform/raindrop')

var express = require('express');
var router = express.Router();

/* POST verifySignature. */
router.post('/', function(req, res, next) {
  const ClientRaindropPartner = new raindrop.client.RaindropPartner({
    hydroKey: "T4CBW91VX7",
    hydroUserName: "8B3BT6S3EX",
    hydroApplicationId: "dfc1e611-763a-43d6-a89d-9c897e8075cd"
  })

  ClientRaindropPartner.setOptions({ environment: 'Dev' })

  let message = req.body.message;
  let userName = req.body.userName;

  ClientRaindropPartner.verifySignature(userName, message)
  .then(result => {
    // Success logic here
    if (result.verified) {
      res.json({verified: true})
    } else {
      res.json({verified: false})
    }
  })
  .catch(error => {
    // Log errors here
    console.log(error)
    res.json({verified: false})
  });
});

module.exports = router;
