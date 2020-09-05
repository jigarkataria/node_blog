const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const CommentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true
  },
  post: {
    type: Schema.Types.ObjectId, ref: 'Article',
    required: true
  },
  givenby: {
    type: Schema.Types.ObjectId, ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
})



module.exports = mongoose.model('Comment', CommentSchema)