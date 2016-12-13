const mongoose = require('mongoose')
const Literature = mongoose.model('Literature')
const Graphic = mongoose.model('Graphic')

module.exports = {
    index: (req, res) => {
        "use strict";
        Literature.find({}).populate('author')
            .then(literature => {
                Graphic.find({}).populate('author').then(graphics => {
                    res.render('home/index', {literature: literature, graphics})
                })
            })
    },
    about: (req, res) => {
        "use strict";
        res.render('home/about')
    }
}
