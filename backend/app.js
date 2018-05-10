var createError = require('http-errors');
var express = require('express');
var path = require('path');
require('dotenv').config()
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var raindrop = require('../../raindrop-sdk-js')

var indexRouter = require('./routes/index');
var getDatabaseRouter = require('./routes/getDatabase');
var deleteDatabaseRouter = require('./routes/deleteDatabase');
var isInDatabaseRouter = require('./routes/isInDatabase');
var registerUserRouter = require('./routes/registerUser');
var unregisterUserRouter = require('./routes/unregisterUser');
var verifySignatureRouter = require('./routes/verifySignature');

var app = express();

// initialize client raindrop
var ClientRaindropPartner = new raindrop.client.RaindropPartner({
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  applicationId: process.env.applicationId
})

ClientRaindropPartner.initialize({ environment: process.env.hydroEnvironment })
  .then(() => { console.log('Hydro API initialized.'); app.set('ClientRaindropPartner', ClientRaindropPartner) })
  .catch(e => console.log('Hydro API initialization failed:', e))

// initialize database
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(path.join('database', 'myDatabase.sqlite'));

new Promise((resolve,reject) => {
  db.serialize(() => {
    //db.run("DROP TABLE IF EXISTS hydro2FA");
    db.run(
      "CREATE TABLE IF NOT EXISTS hydro2FA (internalUsername TEXT PRIMARY KEY, hydroUsername TEXT UNIQUE, confirmed BOOLEAN)",
      [],
      (error) => {
      if (error) {
        console.log('Database initialization failed:', error)
        resolve()
      } else {
        console.log('Database initialized.')
        app.set('db', db)
        resolve()
      }
    });
  });
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/isInDatabase', isInDatabaseRouter);
app.use('/getDatabase', getDatabaseRouter);
app.use('/deleteDatabase', deleteDatabaseRouter);
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
