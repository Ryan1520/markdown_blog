const PORT = 5000
const express = require('express')
const dotenv = require('dotenv').config()
const mongoose = require('mongoose')
const Article = require('./models/article')
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')
const app = express()

mongoose.connect(process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
).then(() => console.log("DBConnection Successfull!"))
.catch((err) => console.log(err));

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))


app.get('/', async (req, res) => {
  // const articles = [
  //   {
  //     title: 'Test Article',
  //     createdAt: new Date(),
  //     description: 'Text description'
  //   },
  //   {
  //     title: 'Test Article 2',
  //     createdAt: new Date(),
  //     description: 'Text description 2'
  //   },
  // ]
  const articles = await Article.find({}).sort({createdAt: 'desc'})
  res.render('articles/index', { articles: articles })
})


app.use('/articles', articleRouter)


app.listen(5000)