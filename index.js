const express = require('express')
const mongoose = require('mongoose')

let app = express()

let env = process.env.NODE_ENV || 'development'
let config = require('./server/config/config')[env]

require('./server/config/database')(config)
require('./server/config/express')(config, app)

let port = process.env.port || 80

app.get('/', (req, res) => {
    "use strict";
    mongoose.connect(config.db)
    res.render('index')
})

app.listen(config.port)

console.log('express RDY!')

