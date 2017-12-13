var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// Get the config file so we have the secret for the session
var config = require('./config/config.js');
// Get the express-session module
var session = require('express-session');

// const passport = require('passport');
// const Auth0Strategy = require('passport-auth0');

var index = require('./routes/index');
var users = require('./routes/users');
var volunteers = require('./routes/volunteers');

// const strategy = new Auth0Strategy(config.auth0,
//   	function(accessToken, refreshToken, extraParams, profile, done) {
// 	    // accessToken is the token to call Auth0 API (not needed in the most cases)
// 	    // extraParams.id_token has the JSON Web Token
// 	    // profile has all the information from the user
// 	    return done(null, profile);
//   	}
// );

// passport.use(strategy);

// you can use this section to keep a smaller payload
// passport.serializeUser(function(user, done) {
//   	done(null, user);
// });

// passport.deserializeUser(function(user, done) {
//   	done(null, user);
// });

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var sessionOptions = {
	secret: config.sessionSalt,
	resave: false,
	saveUninitialized: true
}

app.use(session(sessionOptions));

// app.use(passport.initialize());
// app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Handle auth failure error messages
// app.use(function(req, res, next) {
//  if (req && req.query && req.query.error) {
//    req.flash("error", req.query.error);
//  }
//  if (req && req.query && req.query.error_description) {
//    req.flash("error_description", req.query.error_description);
//  }
//  next();
// });

// Check logged in
// app.use(function(req, res, next) {
//   res.locals.loggedIn = false;
//   if (req.session.passport && typeof req.session.passport.user != 'undefined') {
//     res.locals.loggedIn = true;
//   }
//   next();
// });


app.use('/', index);
app.use('/users', users);
app.use('/volunteers', volunteers);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
