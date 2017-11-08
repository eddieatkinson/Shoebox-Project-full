var express = require('express');
var router = express.Router();

/* GET volunteer listing. */
router.get('/', function(req, res, next) {
  res.send('volunteer page');
});

module.exports = router;
