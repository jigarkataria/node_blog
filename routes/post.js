var express = require('express');
var router = express.Router();
const Article = require('../models/articles');

//- check user is authenticated or not
const checkuser = require('../middleware/check-auth')

router.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  console.log('get articles is here',articles)
 res.render('articles/index', { articles: {articles} })
})

router.get('/new',checkuser, (req, res) => {
  res.render('articles/new', { article: new Article() })
})

router.get('/edit/:id',checkuser, async (req, res) => {
  const article = await Article.findById(req.params.id)
  res.render('articles/edit', { article: article })
})

router.get('/:slug',checkuser, async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug })
  if (article == null) res.redirect('/')
  res.render('articles/show', { article: article })
})

router.post('/',checkuser, async (req, res, next) => {
  console.log('post ')
  req.article = new Article()
  next()
}, saveArticleAndRedirect('new'))

router.post('/:id',checkuser, async (req, res, next) => {
  req.article = await Article.findById(req.params.id)
  next()
}, saveArticleAndRedirect('edit'))

router.delete('/:id',checkuser,async (req, res) => {
  console.log('delete')
  await Article.findByIdAndDelete(req.params.id)
  res.redirect('/')
})

router.get('/delete/:id',async(req,res)=>{
  await Article.findByIdAndDelete(req.params.id)
  res.redirect('/')
})

function saveArticleAndRedirect(path) {
  console.log('saveArticleAndRedirect')
  return async (req, res) => {
    let article = req.article
    article.title = req.body.title;
    article.pageheading = req.body.pageheading;
    article.secondarytext = req.body.secondarytext;
    article.description = req.body.description;
    article.userId = req.session.userId;
    try {
      article = await article.save()
      res.redirect(`/articles/${article.slug}`)
    } catch (e) {
      res.render(`articles/${path}`, { article: article })
    }
  }
}

module.exports = router;
