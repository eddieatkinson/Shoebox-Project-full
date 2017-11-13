var express = require('express');
// const passport = require('passport');
var router = express.Router();
var config = require('../config/config.js');
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');

var connection = mysql.createConnection(config.db);
// router.get('/login-Goog', passport.authenticate('auth0', {
//  	clientID: config.auth0.clientID,
//   	domain: "shoeboxproject.auth0.com",
//   	redirectUri: 'http://localhost:3001/callback',
//   	responseType: 'code',
//   	audience: 'https://shoeboxproject.auth0.com/userinfo',
//   	scope: 'openid profile email'}),
//   	function(req, res) {
//     	res.redirect("/");
// });

/* GET volunteer listing. */
router.get('/', function(req, res, next) {
  res.render('volunteer-form', {});
});

router.get('/login', (req, res, next)=>{
	var notRegistered = false;
	var badPass = false;
	if(req.query.msg == 'notRegistered'){
		notRegistered = true;
	}else if(req.query.msg == 'badPass'){
		badPass = true;
	}
	res.render('volunteer-login', {
		notRegistered: notRegistered,
		badPass: badPass
	});
});

router.get('/logout', (req, res, next)=>{
	req.session.destroy();
	res.redirect('/');
});

router.get('/home', (req, res, next)=>{
	var notPermittedMsg = false;
	if(req.query.msg == 'notPermitted'){
		notPermittedMsg = true;
	}
	var entryAdded = false;
	var notPermitted = true;
	if(req.session.privileges >= 2){
		notPermitted = false;
	}
	if(req.query.msg == "entryAdded"){
		entryAdded = true;
	}
	if(req.session.email == undefined){
		res.redirect('/volunteers/login');
	}else{
		res.render('volunteer-home', {
			entryAdded: entryAdded,
			notPermittedMsg: notPermittedMsg,
			notPermitted: notPermitted,
			name: req.session.name
		});
	}
});

router.get('/blog', (req, res, next)=>{
	if(req.session.email == undefined){
		res.redirect('/volunteers/login');
	}else if(req.session.privileges < 2){
		res.redirect('/volunteers/home?msg=notPermitted');
	}else{
		res.render('volunteer-blog', {});
	}
});

router.post('/blogEntry', (req, res, next)=>{
	var title = req.body.title;
	var body = req.body.body;
	var getAuthor = `SELECT name FROM volunteers WHERE vol_id = ?;`;
	connection.query(getAuthor, [req.session.uid], (error, results)=>{
		if(error){
			throw error;
		}
		console.log(results);
		console.log(req.session.uid);
		var name = results[0].name;
		var insertBlog = `INSERT INTO blog (name, title, body, vol_id)
			VALUES (?, ?, ?, ?);`;
		connection.query(insertBlog, [name, title, body, req.session.uid], (error, results)=>{
			if(error){
				throw error;
			}
			res.redirect('/volunteers/home?msg=entryAdded');
		});
	})
});

router.post('/loginProcess', (req, res, next)=>{
	var email = req.body.email;
	var password = req.body.password;
	var selectQuery = `SELECT * FROM volunteers WHERE email = ?;`;
	connection.query(selectQuery, [email], (error, results)=>{
		if(error){
			throw error;
		}
		if(results.length == 0){
			res.redirect('/volunteers/login?msg=notRegistered');
		}else if(results[0].approved != 1){
			res.redirect('/?msg=notApproved');
		}
		else{
			var passwordsMatch = bcrypt.compareSync(password, results[0].password);
			if(passwordsMatch){
				var row = results[0];
				req.session.name = row.name;
				req.session.uid = row.vol_id;
				req.session.email = row.email;
				req.session.privileges = row.privileges_code;
				console.log(req.session.name);
				console.log(req.session.uid);

				res.redirect('home?msg=loggedIn');
			}else{
				res.redirect('/volunteers/login?msg=badPass');
			}
		}
	});
});

router.post('/signupProcess', (req, res, next)=>{
	var name = req.body.name;
	var email = req.body.email;
	var phone = req.body.phone;
	var password = req.body.password;
	var photographer = req.body.photographer;
	var setUp = req.body.setUp;
	var manager = req.body.manager;
	var processing = req.body.processing;
	var general = req.body.general;
	var consent = req.body.consent;
	// res.send(`name: ${name} email: ${email} phone: ${phone} pass: ${password}`);
	var selectQuery = `SELECT * FROM volunteers WHERE email = ?;`;
	connection.query(selectQuery, [email], (error, results)=>{
		if(error){
			throw error;
		}
		if(results.length != 0){
			res.redirect('login?msg=registered');
		}else{
			var hash = bcrypt.hashSync(password);
			var insertQuery = `INSERT INTO volunteers (name, email, phone, password, photographer, setUp, manager, processing, general, consent, privileges_code)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
			connection.query(insertQuery, [name, email, phone, hash, photographer, setUp, manager, processing, general, consent, 1], (error)=>{ // We're not interested in results and fields
				if(error){
					throw error;
				}else{
					res.redirect('/?msg=registered')
				}
			});
		}
	});
});

module.exports = router;
