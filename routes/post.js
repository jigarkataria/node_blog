//post
var express = require('express');
var router = express.Router();
const Article = require('../models/articles');
const Comment = require('../models/comments')
const passport = require('passport');
//- check user is authenticated or not
const checkuser = require('../middleware/check-auth')

router.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
 res.render('articles/index', { articles: {articles} })
})

router.get('/new',passport.authenticate('jwt', { session : false }), (req, res) => {
  res.render('articles/new', { article: new Article() })
})

router.get('/edit/:id',passport.authenticate('jwt', { session : false }), async (req, res) => {
  const article = await Article.findById(req.params.id)
  res.render('articles/edit', { article: article })
})

router.get('/:slug',passport.authenticate('jwt', { session : false }), async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug }).populate('userId')
  const comment = await Comment.find({post : article._id}).populate('givenby')
  if (article == null) res.redirect('/')
  res.render('articles/show', { article: article , comments : comment})
})

router.post('/',passport.authenticate('jwt', { session : false }), async (req, res, next) => {
  req.article = new Article()
  next()
}, saveArticleAndRedirect('new'))

router.post('/:id',passport.authenticate('jwt', { session : false }), async (req, res, next) => {
  req.article = await Article.findById(req.params.id)
  next()
}, saveArticleAndRedirect('edit'))

router.delete('/:id',passport.authenticate('jwt', { session : false }),async (req, res) => {
  await Article.findByIdAndDelete(req.params.id)
  res.redirect('/')
})

router.get('/delete/:id',async(req,res)=>{
  await Article.findByIdAndDelete(req.params.id)
  res.redirect('/')
})

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article
    article.title = req.body.title;
    article.pageheading = req.body.pageheading;
    article.secondarytext = req.body.secondarytext;
    article.description = req.body.description;
    article.userId = req.session.userId;
    try {
      article = await article.save()
      res.redirect(`/articles/${article.slug}?secret_token=${req.session.token}`)
    } catch (e) {
      res.render(`articles/${path}`, { article: article })
    }
  }
}

module.exports = router;
