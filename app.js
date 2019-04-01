var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const cache = require('./redis')
const forToken = require('./token')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  // 我这里知识把登陆和注册请求去掉了，其他的多有请求都需要进行token校验 

  let token = req.query.token;
  if (token) {
    forToken.getToken(token).then(resp => {
      const {
        name
      } = resp
      console.log(name)
      cache.getVal(`USER:${name}`).then(result => {
        console.log(result)
        if (!result) {
          console.log(result);
          res.send({
            status: 403,
            msg: '该账号未登录'
          });
        } else {
          if (result.token !== token) {
            res.send({
              status: 403,
              msg: '登录已过期,请重新登录'
            });
          } else {
            next();
          }
        }
      })
    })
  } else {
    next()
  }
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;