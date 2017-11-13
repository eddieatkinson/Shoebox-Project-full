var express = require('express');
var router = express.Router();
var config = require('../config/config.js');
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');

var connection = mysql.createConnection(config.db);

/* GET home page. */
router.get('/', function(req, res, next) {
	var registered = false;
    var notApproved = false;
	if(req.query.msg == 'registered'){
		registered = true;
	}else if(req.query.msg == 'notApproved'){
        notApproved = true;
    }
	res.render('index', {
        registered: registered,
        notApproved: notApproved
    });
});

router.get('/blog', function(req, res, next) {
    var selectQuery = `SELECT * FROM blog WHERE approved = "yes" ORDER BY date DESC;`;
    connection.query(selectQuery, (error, results)=>{
        if(error){
            throw error;
        }
        res.render('blog',{
            blog: results
        });    
    });
});

router.get('/blogContents/:blogId', (req, res, next)=>{
    var blogId = req.params.blogId;
    // console.log(`Blog ID = ${blogId}`);
    var selectQuery = `SELECT * FROM blog WHERE blog_id = ?;`;
    connection.query(selectQuery, [blogId], (error, results)=>{
        if(error){
            throw error;
        }
        console.log(`Results = ${results}`);
        var bodyWithBreaks = results[0].body.replace(new RegExp('\r?\n','g'), '<br />');
        console.log(typeof(bodyWithBreaks));
        console.log(bodyWithBreaks);
        res.render('blog-contents', {
            entry: results[0],
            bodyWithBreaks: bodyWithBreaks
        });
    });
});

router.get('/donate', function(req, res, next) {
    res.render('donate',{});
});

router.get('/map', function(req, res, next) {
    var testMessage = "The variable was passed all the way, Eddie!";
    res.render('map',{testMessage: testMessage});
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
