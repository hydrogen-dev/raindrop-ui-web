// load project-specific packages
var path = require('path');
require('dotenv').config(); // load Hydro API credentials
var raindrop = require('@hydrogenplatform/raindrop') // load the raindrop sdk
var sqlite3 = require('sqlite3'); // load our DB manager
// load packages required by express
var logger = require('morgan');
var express = require('express');
var cookieParser = require('cookie-parser');
var createError = require('http-errors');
var session = require('express-session')
// load the routers that define endpoints in the backend's API
var getDatabaseRouter = require('./routes/getDatabase');
var isInDatabaseRouter = require('./routes/isInDatabase');
var messageRouter = require('./routes/message');
var registerUserRouter = require('./routes/registerUser');
var unregisterUserRouter = require('./routes/unregisterUser');
var verifySignatureRouter = require('./routes/verifySignature');

var app = express();

if (process.env.hydroEnvironment === undefined) {
  throw new Error("No configuration file loaded, is your .env file configured properly?")
}

// initialize client raindrop object that will wrap our calls to the Hydro API and save it in the backend's shared state
var ClientRaindropPartner = new raindrop.client.RaindropPartner({
  environment: process.env.hydroEnvironment,
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  applicationId: process.env.applicationId
})

app.set('ClientRaindropPartner', ClientRaindropPartner)

console.log("Javascript SDK for the Hydro API Initialized.")

// initialize database and save it in the backend's shared state
var db = new sqlite3.Database(path.join('database', 'myDatabase.sqlite'));

db.run(
  "CREATE TABLE IF NOT EXISTS hydro2FA " +
  "(internalUsername TEXT PRIMARY KEY, hydroID TEXT UNIQUE, confirmed BOOLEAN)",
  [], (error) => {
  if (error) {console.log('Database initialization failed:', error)}
  else {console.log('Database initialized in database/myDatabase.sqlite.'); app.set('db', db)}
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// initialize sessions
app.use(cookieParser('hydro'));

app.use(session({
  secret: 'hydro', // should in reality be an actual secret
  resave: true, // will vary per-project
  saveUninitialized: false, // will vary per-project
  cookie: { secure: false } // secure should be set to true in a production environment
}))

// register our routes
app.use('/getDatabase', getDatabaseRouter);
app.use('/isInDatabase', isInDatabaseRouter);
app.use('/message', messageRouter);
app.use('/registerUser', registerUserRouter);
app.use('/unregisterUser', unregisterUserRouter);
app.use('/verifySignature', verifySignatureRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
