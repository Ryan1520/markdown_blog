const mongoose = require('mongoose')
const marked = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const {JSDOM} = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  desc: {
    type: String,
  },
  markdown: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  sanitizedHtml: {
    type: String,
    required: true,
  }
})

// https://stackoverflow.com/questions/71882997/validation-failed-slug-path-slug-is-required 
articleSchema.pre('validate', function(next){
  if (this.title) {
    this.slug = slugify(this.title, {lower: true, strict: true})
  }

  if (this.markdown) {
    // https://stackoverflow.com/questions/69929316/nodemon-starting-node-server-js-typeerror-marked-is-not-a-function
    this.sanitizedHtml = dompurify.sanitize(marked.parse(this.markdown))
  }

  next()
})

module.exports = mongoose.model('Article', articleSchema)