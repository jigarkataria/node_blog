const bodyparser = require('body-parser')
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
var registerRouter = require('./routes/register');
var commentsRouter = require('./routes/comment');
var profileRouter = require('./routes/profile')
const dotenv = require('dotenv');
dotenv.config();
const passport = require('passport')
var cors = require('cors')
var app = express();
// app.use(express.urlencoded({extended: true}))
var allowedOrigins = ['http://someorigin.com',
  'http://anotherorigin.com',
  'http://localhost:3000'];
app.use(cors({

  origin: function (origin, callback) {
    // allow requests with no origin
    // (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not ' +
        'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },

  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],

  credentials: true,
}));


require('./auth/auth');
// Body-parser middleware 
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json({ type: 'application/*+json' }))

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
  namme: 'test',
  resave: false,
  saveUnitialized: false,
  secret: 'some',
  cookie: {
    maxAge: 1000 * 2 * 60,
    sameSite: true,
    secure: false
  }
}))
app.use(passport.initialize());
app.use(passport.session());
//- check user is authenticated or not
const checkuser = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect('/login')
  } else {
    next();
  }
}

app.get('/', async (req, res) => { 
  const articles = await Article.find().populate('userId', 'name').sort({ createdAt: 'desc' }).exec();
  if (req.session.name) {
    name = req.session.name;
    token = req.session.token;
  } else {
    name = null;
    token = null;
  }
  res.render('articles/index', { articles: articles, name: name, token: token })
})
app.get('/logout', async (req, res) => {
  req.session.destroy();
  res.redirect('/');
})
// const articles = await Article.find().sort({ createdAt: 'desc' })
// res.render('articles/index', { articles: articles })
app.use('/login', indexRouter);
app.use('/register', registerRouter);
app.use('/articles', postsRouter);
app.use('/comments', commentsRouter);
app.use('/profile', profileRouter);
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/404',
    session: false
  }));


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
