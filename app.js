const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');// Cookie 解析
const logger = require('morgan'); // Log 紀錄
const cors = require('cors');
require('./utils/conn.js');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json') // 剛剛輸出的 JSON

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');
var app = express();

// 記錄錯誤下來，等到服務都處理完後，停掉該 process
process.on('uncaughtException', (err) => {
  console.error('漏洞：Uncaughted Exception')
  console.error(err)
  process.exit(1)
})

// view engine setup Pug 樣版
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//靜態資源路徑設定
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);

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

/**
 * 未捕捉到的 catch
 */
process.on('unhandledRejection', (err, promise) => {
  console.error('漏洞：未捕捉到的 rejection：', promise, '原因：', err)
})

module.exports = app;
