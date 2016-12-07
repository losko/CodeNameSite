const mongoose = require('mongoose')

let literatureSchema = mongoose.Schema({
    category: { type: String, required: true},
    name: { type: String, required: true },
    description: { type: String },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    views: {type: Number},
    date: { type: Date, default: Date.now() }
})

const Literature = mongoose.model('Literature', literatureSchema)

module.exports = Literature