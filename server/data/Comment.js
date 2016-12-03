const mongoose = require('mongoose')

let commentSchema = mongoose.Schema({
    target: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Literature' },
    comment: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    date: { type: Date, default: Date.now() }
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment
