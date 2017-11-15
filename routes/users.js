var express = require('express');
// const passport = require('passport');
var router = express.Router();
var config = require('../config/config.js');
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');

var connection = mysql.createConnection(config.db);

/* GET users listing. */
router.get('/login', (req, res, next)=>{
	var badEmail = false;
	var badPass = false;
	if(req.query.msg == 'notRegistered'){
		badEmail = true;
	}else if(req.query.msg == 'badPass'){
		badPass = true;
	}
	res.render('user-login', {
		badPass: badPass,
		badEmail: badEmail
	});
});

router.get('/home', (req, res, next)=>{
	if(req.session.email == undefined){
		res.redirect('/users/login?msg=notLoggedIn')
	}else{
		var selectQuery = 
			`SELECT url FROM images WHERE id = ?;`;	
		connection.query(selectQuery, [req.session.uid], (error, results)=>{
			if(error){
				throw error;
			}else{
				var galleryQuery = `SELECT gallery_img FROM users WHERE id = ?;`;
				connection.query(galleryQuery, [req.session.uid], (error2, results2)=>{
					if(error){
						throw error;
					}else{
						// res.json(results2);
						res.render('user-home', {
							name: req.session.name,
							url: results,
							cover: results2[0].gallery_img
						});
					}
				})
			}
		});
	}
});

router.post('/loginProcess', (req, res, next)=>{
	var email = req.body.email;
	var password = req.body.password;
	var selectQuery = `SELECT * FROM users WHERE email = ?;`;
	connection.query(selectQuery, [email], (error, results)=>{
		if(error){
			throw error;
		}
		if(results.length == 0){
			res.redirect('/users/login?msg=notRegistered');
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

router.get('/logout', (req,res)=>{
	req.session.destroy();
	res.redirect('/');
});

module.exports = router;