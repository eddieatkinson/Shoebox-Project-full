var express = require('express');
var router = express.Router();
var config = require('../config/config.js');
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');

var connection = mysql.createConnection(config.db);

/* GET home page. */
router.get('/', function(req, res, next) {
	var registered = false;
	if(req.query.msg == 'registered'){
		registered = true;
	}
	res.render('index', {registered: registered});
});

router.get('/blog', function(req, res, next) {
    var selectQuery = `SELECT * FROM blog;`;
    connection.query(selectQuery, (error, results)=>{
        if(error){
            throw error;
        }
        res.render('blog',{blog: results});    
    });
   
});

router.get('/donate', function(req, res, next) {
    res.render('donate',{});
});

router.get('/map', function(req, res, next) {
    res.render('map',{});
});

router.get('/resources', function(req, res, next) {
    res.render('resources',{});
});

// router.get('/user-signup-page', function(req, res, next) {
//   res.render('user-signup',{});
// });

// router.get('/user-home', function(req, res, next) {
//   res.render('user-home',{});
// });

// router.get('/volunteer-signup-form', function(req, res, next) {
//   res.render('volunteer-signup-form',{});
// });

// router.get('/volunteer-form', function(req, res, next) {
//   res.render('volunteer-form',{});
// });

// router.get('/youth-login-form', function(req, res, next) {
//   res.render('youth-login-form',{});
// });


module.exports = router;
