const express = require('express')
const mongoose = require('mongoose')

mongoose.Promise = global.Promise

let app = express()

let env = process.env.NODE_ENV || 'development'
let port = process.env.port || 80

app.set('view engine', 'pug')
app.set('views', './server/views')

app.get('/', (req, res) => {
    "use strict";
    mongoose.connect('mongodb://localhost:27017/codeNameSite')
    console.log('MongoDB Up and RDY!')

    res.render('index')
})

app.use(express.static('public'))

app.listen(port)

console.log('express RDY!')

