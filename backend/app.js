// load project-specific packages
var path = require('path');
require('dotenv').config(); // load Hydro API credentials
var raindrop = require('@hydrogenplatform/raindrop') // load the raindrop sdk
var sqlite3 = require('sqlite3'); //
// load packages required by express
var logger = require('morgan');
var express = require('express');
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var indexRouter = require('./routes/index');
// load the routers that define endpoints in the backend's API
var getDatabaseRouter = require('./routes/getDatabase');
var isInDatabaseRouter = require('./routes/isInDatabase');
var registerUserRouter = require('./routes/registerUser');
var deleteDatabaseRouter = require('./routes/deleteDatabase');
var unregisterUserRouter = require('./routes/unregisterUser');
var verifySignatureRouter = require('./routes/verifySignature');

var app = express();

if (process.env.hydroEnvironment === undefined) {
  throw new Error("No configuration file loaded, is your .env file configured properly?")
}

// initialize client raindrop object that will be wrapping our calls to the Hydro API
var ClientRaindropPartner = new raindrop.client.RaindropPartner({
  environment: process.env.hydroEnvironment,
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  applicationId: process.env.applicationId
})``

// save the object in the backend's shared state
app.set('ClientRaindropPartner', ClientRaindropPartner)

// initialize database
const db = new sqlite3.Database(path.join('database', 'myDatabase.sqlite'));

// save the database in the backend's shared state
db.run(
  "CREATE TABLE IF NOT EXISTS hydro2FA " +
  "(internalUsername TEXT PRIMARY KEY, hydroUsername TEXT UNIQUE, confirmed BOOLEAN)",
  [], (error) => {
  if (error) {console.log('Database initialization failed:', error)}
  else {console.log('Database initialized.'); app.set('db', db)}
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// register our routes
app.use('/', indexRouter);
app.use('/getDatabase', getDatabaseRouter);
app.use('/registerUser', registerUserRouter);
app.use('/isInDatabase', isInDatabaseRouter);
app.use('/deleteDatabase', deleteDatabaseRouter);
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
