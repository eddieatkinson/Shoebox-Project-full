var express = require('express');
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
	res.render('user-home', {});
});

module.exports = router;
