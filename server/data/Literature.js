const mongoose = require('mongoose')

let literatureSchema = mongoose.Schema({
    category: { type: String, required: true}, //Тук искам да вкарам стойноста от селекта
    name: { type: String, required: true },
    description: { type: String },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    date: { type: Date, default: Date.now() }
})

const Literature = mongoose.model('Literature', literatureSchema)

module.exports = Literature