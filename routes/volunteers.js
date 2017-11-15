var express = require('express');
// const passport = require('passport');
var aws = require('aws-sdk');
var router = express.Router();
var fs = require('fs');
var config = require('../config/config.js');
var multerS3 = require('multer-s3');
var multer = require('multer');
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');

var multer = require('multer');
// Tell multer where to save the files it gets
var uploadDir = multer({
	dest: 'public/images'
});

aws.config.loadFromPath('./config/config.json');
aws.config.update({
	signatureVersion: 'v4'
});
var s0 = new aws.S3({});

var upload = multer({
	storage: multerS3({
		s3: s0,
		bucket: 'eddie-first-test-bucket',
		contentType: multerS3.AUTO_CONTENT_TYPE, // Will choose best contentType
		acl: 'public-read',
		metadata: (req, file, cb)=>{
			cb(null, {fieldName: file.fieldname});
		},
		key: (req, file, cb)=>{
			cb(null, Date.now()+file.originalname)
		}
	})
});

// Specify the name of the file input to accept
var nameOfFileField = uploadDir.single('imageToUpload');

var connection = mysql.createConnection(config.db);

/* GET volunteer listing. */
router.get('/', function(req, res, next) {
 	res.render('volunteer-form', {});
});

// Collect info for potential volunteers
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

router.get('/login', (req, res, next)=>{
	var notAdmin = false;
	var notRegistered = false;
	var badPass = false;
	if(req.query.msg == 'notRegistered'){
		notRegistered = true;
	}else if(req.query.msg == 'badPass'){
		badPass = true;
	}else if(req.query.msg == 'notAdmin'){
		notAdmin = true;
	}
	res.render('volunteer-login', {
		notAdmin: notAdmin,
		notRegistered: notRegistered,
		badPass: badPass
	});
});

router.post('/loginProcess', (req, res, next)=>{
	var email = req.body.email;
	var password = req.body.password;
	var selectQuery = `SELECT * FROM volunteers WHERE email = ?;`;
	connection.query(selectQuery, [email], (error, results)=>{
		if(error){
			throw error;
		}
		if(results.length == 0){ // Not in system
			res.redirect('/volunteers/login?msg=notRegistered');
		}else if(results[0].approved == 'no'){ // Not yet approved by admin
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

				res.redirect('home?msg=loggedIn');
			}else{
				res.redirect('/volunteers/login?msg=badPass');
			}
		}
	});
});


router.get('/home', (req, res, next)=>{
	var profilePic ="SELECT vol_img FROM volunteers WHERE  vol_id =? ;";
	connection.query(profilePic, [req.session.uid], (error, results)=>{
		if(error){
			throw error;
		}
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
				volImg: results[0].vol_img,
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

router.get('/uploadUserPhotos/:userId/:volId', (req, res)=>{
	var userId = req.params.userId;
	var volId = req.params.volId;
	res.render('upload-user-photos', {
		userId: userId,
		volId: volId
	});
});

router.post('/uploadUserPhotosProcess/:userId/:volId', upload.any(), (req, res)=>{
	var userId = req.params.userId;
	var volId = req.params.volId;
	var info = req.files;
	var insertUrl = `INSERT INTO images (id, url, vol_id) VALUES (?, ?, ?);`;
	info.map((image)=>{
		connection.query(insertUrl, [userId, image.location, volId], (error, results)=>{
			if(error){
				throw error;
			}
		});
	});
	res.redirect(`/volunteers/userReview?msg=${info.length}`);
});

router.get('/viewPhotos/:userId', (req, res)=>{
	var userId = req.params.userId;
	var selectUserPhoto = `SELECT url FROM images WHERE id = ?;`;
	connection.query(selectUserPhoto, [userId], (error, results)=>{
		if(error){
			throw error;
		}
		res.render('user-photos', {
			images: results
		});
	});
});

// Write blog post
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
		if(error){
			throw error;
		}
		var name = results[0].name;
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

router.get('/logout', (req, res, next)=>{
	req.session.destroy();
	res.redirect('/');
});

/////////////////////////////////
//////////ADMIN DASHBOARD////////
/////////////////////////////////

// Manage volunteers
router.get('/volunteerReview', (req, res)=>{
	if(req.session.privileges != 3){
		res.redirect('/volunteers/login?msg=notAdmin');
	}
	var commentsAdded = false;
	if(req.query.msg == 'commentsAdded'){
		commentsAdded = true;
	}
	var commentsReplaced = false;
	if(req.query.msg == 'commentsReplaced'){
		commentsReplaced = true;
	}
	var levelChanged = false;
	if(req.query.msg == 'levelChanged'){
		levelChanged = true;
	}
	var approved = false;
	if(req.query.msg == 'approved'){
		approved = true;
	}
	var denied = false;
	if(req.query.msg == 'denied'){
		denied = true;
	}
	var selectQuery = `SELECT * FROM volunteers LEFT JOIN privileges ON volunteers.privileges_code = privileges.privileges_code ORDER BY vol_id;`;
	connection.query(selectQuery, (error, results)=>{
		if(error){
			throw error;
		}
		res.render('admin-dashboard-vol', {
			commentsAdded: commentsAdded,
			commentsReplaced: commentsReplaced,
			levelChanged: levelChanged,
			volunteers: results,
			approved: approved,
			denied: denied
		});
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

router.get('/volunteerReview/changeToAdmin/:vol_id', (req, res, next)=>{
	var volId = req.params.vol_id;
	var update = `UPDATE volunteers SET privileges_code = 3 WHERE vol_id = ?;`;
	connection.query(update, [volId], (error, results)=>{
		if(error){
			throw error;
		}
		res.redirect('/volunteers/volunteerReview?msg=levelChanged');
	});
});

router.get('/volunteerReview/changeToAuthor/:vol_id', (req, res, next)=>{
	var volId = req.params.vol_id;
	var update = `UPDATE volunteers SET privileges_code = 2 WHERE vol_id = ?;`;
	connection.query(update, [volId], (error, results)=>{
		if(error){
			throw error;
		}
		res.redirect('/volunteers/volunteerReview?msg=levelChanged');
	});
});

router.get('/volunteerReview/changeToBasic/:vol_id', (req, res, next)=>{
	var volId = req.params.vol_id;
	var update = `UPDATE volunteers SET privileges_code = 1 WHERE vol_id = ?;`;
	connection.query(update, [volId], (error, results)=>{
		if(error){
			throw error;
		}
		res.redirect('/volunteers/volunteerReview?msg=levelChanged');
	});
});

router.post('/addComment/:volId', (req, res, next)=>{
	var comments = req.body.comments;
	var volId = req.params.volId;
	var updateComments = 
	// `UPDATE volunteers SET comments = ? WHERE vol_id = ?;`;
	`UPDATE volunteers SET comments = concat(comments, " ", ?) WHERE vol_id = ?;`;
	connection.query(updateComments, [comments, volId], (error, results)=>{
		if(error){
			throw error;
		}
		res.redirect('/volunteers/volunteerReview?msg=commentsAdded');
	});
});

router.post('/replaceComment/:volId', (req, res, next)=>{
	var comments = req.body.comments;
	var volId = req.params.volId;
	var updateComments = 
	`UPDATE volunteers SET comments = ? WHERE vol_id = ?;`;
	connection.query(updateComments, [comments, volId], (error, results)=>{
		if(error){
			throw error;
		}
		res.redirect('/volunteers/volunteerReview?msg=commentsReplaced');
	});
});

// Manage users
router.get('/userReview', (req, res)=>{
	if(req.session.privileges != 3){
		res.redirect('/volunteers/login?msg=notAdmin');
	}
	var numPhotos = -1;
	if(Number(req.query.msg) != NaN){
		var numPhotos = Number(req.query.msg);
	}
	var commentsAdded = false;
	if(req.query.msg == 'commentsAdded'){
		commentsAdded = true;
	}
	var commentsReplaced = false;
	if(req.query.msg == 'commentsReplaced'){
		commentsReplaced = true;
	}
	// Get only one image from each user's gallery to display
	var selectQuery = `SELECT * 
		FROM users
		LEFT JOIN (
			SELECT images.id, images.img_id, images.url, images.date_uploaded, images.vol_id
			FROM (
				SELECT id, MIN(img_id) as minId 
				FROM images GROUP BY id
			) AS x INNER JOIN images ON images.id = x.id AND images.img_id = x.minId
		) AS images ON users.id = images.id ORDER BY users.id;`;
	connection.query(selectQuery, (error, results)=>{
		if(error){
			throw error;
		}
		res.render('admin-dashboard-users', {
			numPhotos: numPhotos,
			volunteerId: req.session.uid,
			commentsAdded: commentsAdded,
			commentsReplaced: commentsReplaced,
			users: results
		});
	});
});

router.post('/addUserComment/:userId', (req, res, next)=>{
	var comments = req.body.comments;
	var userId = req.params.userId;
	var updateComments = 
	`UPDATE users SET comments = concat(comments, " ", ?) WHERE id = ?;`;
	connection.query(updateComments, [comments, userId], (error, results)=>{
		if(error){
			throw error;
		}
		res.redirect('/volunteers/userReview?msg=commentsAdded');
	});
});

router.post('/replaceUserComment/:userId', (req, res, next)=>{
	var comments = req.body.comments;
	var userId = req.params.userId;
	var updateComments = 
	`UPDATE users SET comments = ? WHERE id = ?;`;
	connection.query(updateComments, [comments, userId], (error, results)=>{
		if(error){
			throw error;
		}
		res.redirect('/volunteers/userReview?msg=commentsReplaced');
	});
});

// Manage blog posts
router.get('/blogReview', (req, res, next)=>{
	if(req.session.privileges != 3){
		res.redirect('/volunteers/home?msg=unauthorized');
	}
	res.redirect('/blog?msg=blogReview');
});

module.exports = router;