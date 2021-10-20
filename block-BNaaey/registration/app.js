var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


mongoose.connect(
  'mongodb://localhost/registration',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    console.log('Connected', err ? false : true);
  }
);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// session middleware must always be set after cookiesParser has been added as middleware
app.use(session({
  secret: "somerandomsecret", // it should not be post on github
  // A session is only created if it has been modified
  // if it has some addtional user content then only it going to intialized a session
  // The session is not going to save forcefully all the time even though we don't make any modification 
  saveUninitialized: false,
  resave: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))


app.use('/', indexRouter);
app.use('/users', usersRouter);

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