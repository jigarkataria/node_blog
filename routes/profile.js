var express = require('express')
var multer  = require('multer')
var upload = multer({ dest: 'upload/' })
var User = require('../models/users')
var app = express();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/upload')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+'.png')
    }
  })

  app.get('/', async (req, res) => {
    
   res.render('profile')
  })
   
  var upload = multer({ storage: storage }).single('avatar');

  app.post('/', function (req, res) {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
          console.log(err,'multiple error')
        // A Multer error occurred when uploading.
      } else if (err) {
          console.log(err,'single error')
        // An unknown error occurred when uploading.
      }
      console.log('response fromm multer',req.file.filename)
      
     let operation = User.findOneAndUpdate({email : req.session.email },{$set:{'profilepic': req.file.filename}}).exec();
      console.log(operation,'operation***')
     res.redirect('/')
      // Everything went fine.
    })
  })


  module.exports = app;
