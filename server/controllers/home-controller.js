const mongoose = require('mongoose')
const Literature = mongoose.model('Literature')

module.exports = {
    index: (req, res) => {
        "use strict";
        Literature.find({}).limit(6).populate('author')
            .then(literatures => {
                res.render('home/index', {literatures: literatures})
            })
    },
    about: (req, res) => {
        "use strict";
        res.render('home/about')
    }
}
