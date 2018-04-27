const raindrop = require('@hydrogenplatform/raindrop')

var express = require('express');
var router = express.Router();

/* POST registerUser. */
router.post('/', function(req, res, next) {
  const ClientRaindropPartner = new raindrop.client.RaindropPartner({
    hydroKey: "T4CBW91VX7",
    hydroUserName: "8B3BT6S3EX",
    hydroApplicationId: "dfc1e611-763a-43d6-a89d-9c897e8075cd"
  })

  ClientRaindropPartner.setOptions({ environment: 'Dev' })

  let userName = req.body.hydroUserName;

  ClientRaindropPartner.registerUser(userName)
    .then(result => {
      // Success logic here
      console.log(result)
      res.json({registered: true})
    })
    .catch(error => {
      // Log errors here
      console.log(error)
      res.json({registered: false})
    });
});

module.exports = router;
