const mongoose = require('mongoose')
const slugify = require('slugify')
var Schema = mongoose.Schema;

const articleSchema = new mongoose.Schema({
  pageheading:{
    type: String,
    required: true
  },  
  secondarytext: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
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
  userId:{
    type: Schema.Types.ObjectId, ref: 'User',
    required:true
  }
 
})

articleSchema.pre('validate', function(next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true })
  }
  next()
})

module.exports = mongoose.model('Article', articleSchema)