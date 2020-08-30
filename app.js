var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoose = require('mongoose')
const Article = require('./models/articles')
const session = require('express-session')

var indexRouter = require('./routes/index');
var postsRouter = require('./routes/post');
var registerRouter = require('./routes/register')
const dotenv = require('dotenv');
dotenv.config();
var app = express();

mongoose.connect('mongodb://localhost/blog', {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})
// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//- seesion
app.use(session({
  namme:'test',
  resave: false,
  saveUnitialized: false,
  secret: 'some',
  cookie:{
    maxAge : 1000 * 2 * 60,
    sameSite : true,
    secure: false
  }
}))

//- check user is authenticated or not
const checkuser = (req,res,next)=>{
  if(!req.session.userId){
   res.redirect('/login')
  }else{
    next();
  }
}

app.get('/', async (req, res) => {
  console.log('/get',req.session)
  const articles = await Article.find().sort({ createdAt: 'desc' });
  if(req.session.name){
    name = req.session.name;
  }else{
    name = null;
  }
  res.render('articles/index', { articles: articles , name : name})
})
app.get('/logout',async (req,res)=>{
  req.session.destroy();
  res.redirect('/');
})
// const articles = await Article.find().sort({ createdAt: 'desc' })
  // res.render('articles/index', { articles: articles })
app.use('/login', indexRouter);
app.use('/register',registerRouter);
app.use('/articles', postsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err,'*********')
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
