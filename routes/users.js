var express = require('express');
// const passport = require('passport');
var router = express.Router();
var config = require('../config/config.js');
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');

var connection = mysql.createConnection(config.db);
/* GET users listing. */
router.get('/login', (req, res, next)=>{
	res.render('user-login', {});
});

router.get('/home', (req, res, next)=>{
	if(req.session.email == undefined){
		// loggedIn = false;
		res.redirect('/users/login?msg=notLoggedIn')
	}else{
		// loggedIn = true;
		var selectQuery = 
			`SELECT url FROM images WHERE id = ?;`;
		connection.query(selectQuery, [req.session.uid], (error, results)=>{
			if(error){
				throw error;
			}else{
				// res.json(results);
				res.render('user-home', {
					name: req.session.name,
					url: results
				});
			}
		});
	}
});

// router.get('/login-Goog', passport.authenticate('auth0', {
//  	clientID: config.auth0.clientID,
//   	domain: "shoeboxproject.auth0.com",
//   	redirectUri: 'http://localhost:3000/callback',
//   	responseType: 'code',
//   	audience: 'https://shoeboxproject.auth0.com/userinfo',
//   	scope: 'openid profile email'}),
//   	function(req, res) {
//     	res.redirect("/");
// });

router.post('/loginProcess', (req, res, next)=>{
	var email = req.body.email;
	var password = req.body.password;
	var selectQuery = `SELECT * FROM users WHERE email = ?;`;
	connection.query(selectQuery, [email], (error, results)=>{
		if(error){
			throw error;
		}
		if(results.length == 0){
			res.redirect('/?msg=notRegistered');
		}else{
			var passwordsMatch = bcrypt.compareSync(password, results[0].password);
			if(passwordsMatch){
				var row = results[0];
				req.session.name = row.first_name;
				req.session.uid = row.id;
				req.session.email = row.email;
				// console.log("session name: " + req.session.name);

				res.redirect('/users/home?msg=loggedIn');
			}else{
				res.redirect('/users/login?msg=badPass');
			}
		}
	});
});

module.exports = router;
