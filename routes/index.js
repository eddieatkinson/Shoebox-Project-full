var express = require('express');
var router = express.Router();
var config = require('../config/config.js');
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');

var connection = mysql.createConnection(config.db);

/* GET home page. */
router.get('/', function(req, res, next){
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
	var approved = false;
	var hidden = false;
	var notAdmin = false;
	var review = false;
	console.log(req.query.msg);
	if(req.query.msg == 'blogReview' || req.query.msg == 'blogReviewApproved' || req.query.msg == 'blogReviewHidden'){
		if(req.session.privileges == 3){
			review = true;
		}else{
			notAdmin = true;
		}
	}
	if(req.query.msg == 'blogReviewApproved'){
		approved = true;
	}
	if(req.query.msg == 'blogReviewHidden'){
		hidden = true;
	}
	if(review){ // Administrator privileges -- will see ALL blogs
		var selectQuery = `SELECT * FROM blog ORDER BY blog_id DESC;`;
	}else{ // Anyone else will only see approved blogs
		var selectQuery = `SELECT * FROM blog WHERE approved = "yes" ORDER BY blog_id DESC;`;
	}
	connection.query(selectQuery, (error, results)=>{
		if(error){
			throw error;
		}
		res.render('blog',{
			review: review,
			notAdmin: notAdmin,
			blog: results,
			approved: approved,
			hidden: hidden
		});    
	});
});

router.get('/blog/approvePost/:blogId', (req, res, next)=>{
	var blogId = req.params.blogId;
	var update = `UPDATE blog SET approved = 'yes' WHERE blog_id = ?;`;
	connection.query(update, [blogId], (error, results)=>{
		if(error){
			throw error;
		}
		res.redirect('/blog?msg=blogReviewApproved');
	});
});

router.get('/blog/hidePost/:blogId', (req, res, next)=>{
	var blogId = req.params.blogId;
	var update = `UPDATE blog SET approved = 'no' WHERE blog_id = ?;`;
	connection.query(update, [blogId], (error, results)=>{
		if(error){
			throw error;
		}
		res.redirect('/blog?msg=blogReviewHidden');
	});
});

router.get('/blogContents/:blogId', (req, res, next)=>{
	var blogId = req.params.blogId;
	var selectQuery = `SELECT * FROM blog WHERE blog_id = ?;`;
	connection.query(selectQuery, [blogId], (error, results)=>{
		if(error){
			throw error;
		}
		// console.log(`Results = ${results}`);
		// var bodyWithBreaks = results[0].body.replace(new RegExp('\r?\n','g'), '<br />');
		// console.log(typeof(bodyWithBreaks));
		// console.log(bodyWithBreaks);
		res.render('blog-contents', {
			entry: results[0],
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

module.exports = router;
