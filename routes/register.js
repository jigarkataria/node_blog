var express = require('express');
var router = express.Router();
// var Users = require('../models/users');
// var bcrypt = require ('bcrypt')
const passport = require('passport');
const jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/', async (req, res) => {
   res.render('register',{error: null})
  })
  

router.post('/', passport.authenticate('signup', { session : false }) , async (req, res, next) => {
    res.render('login',{error:null});
  });

  module.exports = router;
  