var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const handleError = require('./utils/handleError');
const httpStatus = require('./utils/httpStatus');

dotenv.config({
    path:'./config.env'
});

const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
  );
   
mongoose.connect(DB).then(()=>{
    console.log('DB Conntection SUCCESS!');
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
/*
app.use((req, res, next) => {
    next();
});
*/
app.use((req, res, next) => {
    res.status(httpStatus.NOT_FOUND).send("NOT FOUND")
});
app.use(function(err,req,res,next){
    res.status(httpStatus.INTERNAL_SERVER).send('程式有些問題，請稍後嘗試')
})
module.exports = app;
