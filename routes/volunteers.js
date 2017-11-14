var express = require('express');
// const passport = require('passport');
var router = express.Router();
var fs = require('fs');
var config = require('../config/config.js');
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');

var multer = require('multer');
// Tell multer where to save the files it gets
var uploadDir = multer({
	dest: 'public/images'
});

// Specify the name of the file input to accept
var nameOfFileField = uploadDir.single('imageToUpload');

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

router.get('/uploadPic', (req, res, next)=>{
	res.render('volunteer-pic-upload', {});
});

router.post('/uploadPic', nameOfFileField, (req, res)=>{
	var tmpPath = req.file.path;
	var targetPath = `public/images/${req.file.originalname}`;
	fs.readFile(tmpPath, (error, fileContents)=>{
		if(error){
			throw error;
		}
		fs.writeFile(targetPath, fileContents, (error)=>{
			if(error){
				throw error;
			}
			var update = `UPDATE volunteers SET vol_img = ? WHERE vol_id = ?`;
			connection.query(update, [req.file.originalname, req.session.uid], (dbError)=>{
				if(dbError){
					throw dbError;
				}
				res.redirect('/volunteers/home?msg=picUploaded');
			});
		});
	});
});

router.get('/volunteerReview', (req, res)=>{
	var commentsAdded = false;
	if(req.query.msg == 'commentsAdded'){
		commentsAdded = true;
	}
	var approved = false;
	if(req.query.msg == 'approved'){
		approved = true
	}
	var denied = false;
	if(req.query.msg == 'denied'){
		denied = true
	}
	var selectQuery = `SELECT * FROM volunteers LEFT JOIN privileges ON volunteers.privileges_code = privileges.privileges_code ORDER BY vol_id;`;
	connection.query(selectQuery, (error, results)=>{
		// console.log(results);
		// console.log(req.session.uid);
		if(error){
			throw error;
		}
		res.render('admin-dashboard', {
			commentsAdded: commentsAdded,
			volunteers: results,
			approved: approved,
			denied: denied
		});
		// var name = results[0].name;
		// var bodyWithBreaks = results[0].body.replace(new RegExp('\r?\n','g'), '<br />');
		// var insertBlog = `INSERT INTO blog (name, title, body, vol_id)
		// 	VALUES (?, ?, ?, ?);`;
		// connection.query(insertBlog, [name, title, bodyWithBreaks, req.session.uid], (error, results)=>{
		// 	if(error){
		// 		throw error;
		// 	}
		// 	res.redirect('/volunteers/home?msg=entryAdded');
		// });
	});
});

router.get('/volunteerReview/approve/:vol_id', (req, res, next)=>{
	var volId = req.params.vol_id;
	var update = `UPDATE volunteers SET approved = 'yes' WHERE vol_id = ?;`;
	connection.query(update, [volId], (error, results)=>{
		if(error){
			throw error;
		}
		res.redirect('/volunteers/volunteerReview?msg=approved');
	});
});

router.get('/volunteerReview/deny/:volId', (req, res, next)=>{
	var volId = req.params.volId;
	var update = `UPDATE volunteers SET approved = 'no' WHERE vol_id = ?;`;
	connection.query(update, [volId], (error, results)=>{
		if(error){
			throw error;
		}
		res.redirect('/volunteers/volunteerReview?msg=denied');
	});
});


router.post('/addComment/:volId', (req, res, next)=>{
	var comments = req.body.comments;
	var volId = req.params.volId;
	var updateComments = `UPDATE volunteers SET comments = ? WHERE vol_id = ?;`;
	connection.query(updateComments, [comments, volId], (error, results)=>{
		if(error){
			throw error;
		}
		res.redirect('/volunteers/volunteerReview?msg=commentsAdded');
	});
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
	var picUploaded = false;
	if(req.query.msg == 'picUploaded'){
		picUploaded = true;
	}
	var unauthorized = false;
	if(req.query.msg == 'unauthorized'){
		unauthorized = true;
	}
	var admin = false;
	var notPermittedMsg = false;
	if(req.session.privileges == 3){
		admin = true;
	}
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
			picUploaded: picUploaded,
			entryAdded: entryAdded,
			notPermittedMsg: notPermittedMsg,
			notPermitted: notPermitted,
			name: req.session.name,
			unauthorized: unauthorized,
			admin: admin
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
	var bodyWithBreaks = body.replace(new RegExp('\r?\n','g'), '<br />');
	var getAuthor = `SELECT name FROM volunteers WHERE vol_id = ?;`;
	connection.query(getAuthor, [req.session.uid], (error, results)=>{
		// console.log(results);
		// console.log(req.session.uid);
		if(error){
			throw error;
		}
		var name = results[0].name;
		// var bodyWithBreaks = results[0].body.replace(new RegExp('\r?\n','g'), '<br />');
		var insertBlog = `INSERT INTO blog (name, title, body, vol_id)
			VALUES (?, ?, ?, ?);`;
		connection.query(insertBlog, [name, title, bodyWithBreaks, req.session.uid], (error, results)=>{
			if(error){
				throw error;
			}
			res.redirect('/volunteers/home?msg=entryAdded');
		});
	});
});

router.get('/blogReview', (req, res, next)=>{
	if(req.session.privileges != 3){
		res.redirect('/volunteers/home?msg=unauthorized');
	}
	res.redirect('/blog?msg=blogReview');
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
		}else if(results[0].approved == 'no'){
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