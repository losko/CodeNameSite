const mongoose = require('mongoose')
const Literature = mongoose.model('Literature')
const Graphic = mongoose.model('Graphic')

module.exports = {
    index: (req, res) => {
        "use strict";
        Literature.count({}, function( err, litCount){
            if (err) {

            } else {
                Graphic.count({}, function( err, grapCount){
                    if (err) {

                    } else {
                        if (req.session.skip !== undefined) {
                            let limit = 3
                            let skip = 0
                            let pages = Math.ceil(Math.max(litCount, grapCount) / 3)
                            skip = parseInt(req.query.page) * limit
                            let currentPage = parseInt(req.query.page) || 0
                            Literature.find({}).skip(skip).limit(limit).populate('author')
                                .then(literature => {
                                    Graphic.find({}).skip(skip).limit(limit).populate('author').then(graphics => {
                                        graphics.page = 0
                                        res.render('home/index', {literature: literature, graphics, pages, currentPage})
                                    })
                                })
                        } else {
                            let limit = 3
                            let skip = 0
                            let pages = Math.ceil(Math.max(litCount, grapCount) / 3)
                            req.session.skip = 0
                            let currentPage = 0
                            Literature.find({}).skip(skip).limit(limit).populate('author')
                                .then(literature => {
                                    Graphic.find({}).skip(skip).limit(limit).populate('author').then(graphics => {
                                        graphics.page = 0
                                        res.render('home/index', {literature: literature, graphics, pages, currentPage})
                                    })
                                })

                        }
                    }
                })
            }
        })

    },
    about: (req, res) => {
        "use strict";
        let active = 'active'
        res.render('home/about', {active: active})
    }
}
