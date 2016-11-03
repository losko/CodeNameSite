const express = require('express')
const mongoose = require('mongoose')

let app = express()

app.get('/', (req, res) => {
    "use strict";
    mongoose.connect('mongodb://localhost:27017/codeNameSite')
    console.log('MongoDB Up and Rdy!')

    res.send('Cool')
})

app.listen(80)

console.log('express RDY!')

