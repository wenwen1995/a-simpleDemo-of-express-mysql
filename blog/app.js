var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var index = require('./routes/index');

var main = require('./routes/main');
var regist = require('./routes/regist');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser("An"));

app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  secret:'an',
  resave:false, //是指每次请求都重新设置session cookie，假设你的cookie是10分钟过期，每次请求都会再设置10分钟
  saveUninitialized:false //是指无论有没有session cookie，每次请求都设置个session cookie ，默认给个标示为 connect.sid
}));

app.use('/', index);
app.use('/main', main);
app.use('/regist', regist);



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
