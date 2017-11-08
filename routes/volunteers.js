var express = require('express');
var router = express.Router();

/* GET volunteer listing. */
router.get('/', function(req, res, next) {
  res.render('volunteer-form', {});
});

module.exports = router;
