var express = require('express');
var router = express.Router();

/* GET volunteer listing. */
router.get('/', function(req, res, next) {
  res.render('volunteer-form', {});
});

router.get('/login', (req, res, next)=>{
	res.render('volunteer-login', {});
});

module.exports = router;
