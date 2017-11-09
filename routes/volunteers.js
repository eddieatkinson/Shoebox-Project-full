var express = require('express');
var router = express.Router();
var config = require('../config/config.js');
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');

var connection = mysql.createConnection(config.db);
/* GET volunteer listing. */
router.get('/', function(req, res, next) {
  res.render('volunteer-form', {});
});

router.get('/login', (req, res, next)=>{
	res.render('volunteer-login', {});
});

router.post('/loginProcess', (req, res, next)=>{
	var email = req.body.email;
	var password = req.body.password;
});

router.post('/signupProcess', (req, res, next)=>{
	var name = req.body.name;
	var email = req.body.email;
	var phone = req.body.phone;
	var password = req.body.password;
	// res.send(`name: ${name} email: ${email} phone: ${phone} pass: ${password}`);
	var selectQuery = `SELECT * FROM volunteers WHERE email = ?;`;
	connection.query(selectQuery, [email], (error, results)=>{
		if(results.length != 0){
			res.redirect('/login?msg=registered');
		}else{
			var hash = bcrypt.hashSync(password);
			var insertQuery = `INSERT INTO volunteers (name, email, phone, password) VALUES (?, ?, ?, ?);`;
			connection.query(insertQuery, [name, email, phone, hash], (error)=>{ // We're not interested in results and fields
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
