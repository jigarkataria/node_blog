var express = require('express');
var router = express.Router();
// var Users = require('../models/users');
// var bcrypt = require ('bcrypt')
const passport = require('passport');
const jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/', async (req, res) => {
   res.render('register',{errors: ""})
  })
  

router.post('/', passport.authenticate('signup', { session : false }) , async (req, res, next) => {
    res.redirect('/login');
  });

  module.exports = router;
  