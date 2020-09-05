var express = require('express');
var router = express.Router();
var Users = require('../models/users');
var bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const passport = require('passport');

//- check while user hit login
const checkifuserloggedin = (req,res,next)=>{
  if(req.session.userId){
    res.redirect('/')
  }else{
    next();   
  }
}
/* login - get */
router.get('/',checkifuserloggedin, async (req, res) => {
  res.render('login',{error:null})
})

router.post('/', async (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {     try {
      if(err || !user){
        const error = new Error(info.message)
        console.log(err,'error in authenticate')
        return next(error);
        // res.redirect('/login',{error:info})
      }
      req.login(user, { session : false }, async (error) => {
        if( error ) return next(error)
        //We don't want to store the sensitive information such as the
        //user password in the token so we pick only the email and id
        const body = { _id : user._id, email : user.email };
        //Sign the JWT token and populate the payload with the user email and id
        const token = jwt.sign({ user : body },'top_secret');
        //Send back the token to the user
        req.session.token = token;
         req.session.userId = user._id;
         req.session.name = user.name;
         req.session.email = req.body.email;
         res.redirect('/');
      });     
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});
module.exports = router;
