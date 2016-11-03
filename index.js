const express = require('express')
const mongoose = require('mongoose')

mongoose.Promise = global.Promise

let app = express()

let env = process.env.NODE_ENV || 'development'
let config = require('./server/config/config')[env]

let port = process.env.port || 80


app.set('view engine', 'pug')
app.set('views', './server/views')

app.get('/', (req, res) => {
    "use strict";
    mongoose.connect(config.db)
    console.log('MongoDB Up and RDY!')

    res.render('index')
})

app.use(express.static('public'))

app.listen(config.port)

console.log('express RDY!')

