var express = require('express')
var multer  = require('multer')
var upload = multer({ dest: 'upload/' })
var User = require('../models/articles')
var app = express();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/upload')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+'.png')
    }
  })

  app.get('/:id', async (req, res) => {
    
   res.render('blogpic',{slugid:req.params.id})
  })
   
  var upload = multer({ storage: storage }).single('avatar');

  app.post('/:id', function (req, res) {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        
        // A Multer error occurred when uploading.
      } else if (err) {
         
        // An unknown error occurred when uploading.
      }    
      
     let operation = User.findOneAndUpdate({_id : req.params.id},{$set:{'blogpic': req.file.filename}}).exec();
     res.redirect('/')
      // Everything went fine.
    })
  })


  module.exports = app;
