const Literature = require('mongoose').model('Literature')
const Graphic = require('mongoose').model('Graphic')
module.exports = {
    searchPost: (req, res) => {
        "use strict";
        let search = req.body
        if (search.search === '') {
            Literature.find({}).populate('author')
                .then(resultL => {
                    Graphic.find({}).populate('author').then(resultG => {
                        res.render('search/search', {resultG: resultG, resultL})
                    })
                })
        } else {
            Literature.find({name: {$regex: search.search}}).populate('author')
                .then(resultL => {
                    Graphic.find({name: {$regex: search.search}}).populate('author').then(resultG => {
                        res.render('search/search', {resultG: resultG, resultL})
                    })
                })
        }
    }
}