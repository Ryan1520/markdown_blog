const express = require('express')
const router = express.Router()
const Article = require('./../models/article')

router.get('/new', (req, res) => {
  res.render('articles/new', { article: new Article() })
})

router.get('/edit/:id', async (req, res) => {
  const article = await Article.findById(req.params.id)
  // console.log(article)
  res.render('articles/edit', { article: article })
})

router.get('/:slug', async (req, res) => {
  try{
    const article = await Article.findOne({slug: req.params.slug})
    // console.log(article)
    res.render('articles/show', {article: article})
  } catch(err) {
    res.redirect("/")
    console.log(err)
  }
})

router.post('/', async (req,res) => {
  let article = new Article({
    title: req.body.title,
    desc: req.body.desc,
    markdown: req.body.markdown,
  })
  try{
    article = await article.save()
    res.redirect(`/articles/${article.slug}`)
  } catch (err) {
    console.log(err)
    res.render('articles/new', {article: article})
  }
})

router.put('/:id', async (req, res) => {
  let article = {
    title: req.body.title,
    desc: req.body.desc,
    markdown: req.body.markdown,
  }
  try{
    // https://masteringjs.io/tutorials/mongoose/update
    article = await Article.findOneAndUpdate({_id: req.params.id}, article, {new: true})
    console.log(article)
    res.redirect(`/articles/${article.slug}`)
  } catch (err) {
    console.log(err)
    res.render('articles/edit', {article: article})
  }
})

router.delete('/:id', async (req,res) => {
  try{
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
  } catch(err) {
    console.log(err)
  }
})


module.exports = router