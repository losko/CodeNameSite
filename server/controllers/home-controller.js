const mongoose = require('mongoose')
const Literature = mongoose.model('Literature')
const Graphic = mongoose.model('Graphic')

module.exports = {
    index: (req, res) => {
        "use strict";
        Literature.find({}).populate('author')
            .then(content => {
                res.render('home/index', {content: content})
            })
    },
    about: (req, res) => {
        "use strict";
        res.render('home/about')
    }
}
