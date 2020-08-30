var express = require('express');
var router = express.Router();
var Users = require('../models/users');
var bcrypt = require('bcrypt');


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
  res.render('login')
})

/* login - post */
router.post('/', (req, res) => {
  Users.find({
    email: req.body.email
  }).then(function (users) {
    console.log(users,'userrs afterr find')
    if (users.length > 0) {
      let user = users[0];
      let passwordHash = user.password;
      if (bcrypt.compareSync(req.body.password, passwordHash)) {
        req.session.userId = user._id;
        req.session.name = user.name;
        req.session.email = req.body.email;
        console.log(req.session,'Session ID')
        res.redirect('/');
      }
      else {
        res.redirect('/register');
      }
    }
    else {
      res.redirect('/login');
    }
  });
});
module.exports = router;
