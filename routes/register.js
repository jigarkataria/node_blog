var express = require('express');
var router = express.Router();
var Users = require('../models/users');
var bcrypt = require ('bcrypt')

/* GET home page. */
router.get('/', async (req, res) => {
   res.render('register',{errors: ""})
  })
  

  router.post('/',async (req,res) =>{
    // var matched_users_promise = await Users.find({     
    //          email : req.body.email 
    // });
    Users.find({     
        email : req.body.email 
}).then(function(users){ 
        if(users.length == 0){
            const passwordHash = bcrypt.hashSync(req.body.password,10);
            Users.create({
                name: req.body.name,
                email: req.body.email,
                password: passwordHash
            }).then(function(){
                let newSession = req.session;
                newSession.email = req.body.email;
                res.redirect('/login');
            });
        }
        else{
            res.render('account/register',{errors: "Username or Email already in user"});
        }
    })
});


  module.exports = router;
  