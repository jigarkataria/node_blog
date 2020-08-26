var express = require('express');
var router = express.Router();
const Article = require('./../models/articles');

/* GET home page. */
router.get('/', async (req, res) => {
  res.render('index')
})




module.exports = router;
