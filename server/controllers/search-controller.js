const Literature = require('mongoose').model('Literature')
const Graphic = require('mongoose').model('Graphic')
module.exports = {
    searchGet: (req, res) => {
        "use strict";
        let search = req.query.search.toLowerCase()
        if (!search) {
            Literature.count({}, function (err, litCount) {
                if (err) {

                } else {
                    Graphic.count({}, function (err, grapCount) {
                        if (err) {

                        } else {
                            let limit = 3
                            let skip = 0
                            let pages = Math.ceil(Math.max(litCount, grapCount) / 3)
                            skip = parseInt(req.query.page) * limit || 0
                            let currentPage = parseInt(req.query.page) || 0
                            Literature.find({}).skip(skip).limit(limit).populate('author').then(literature => {
                                Graphic.find({}).skip(skip).limit(limit).populate('author').then(graphics => {
                                    graphics.page = 0
                                    res.render('search/search', {literature: literature, graphics, pages, currentPage})
                                })
                            })
                        }
                    })
                }
            })
        } else {
            Literature.count({name: {$regex: search}}, function (err, litCount) {
                if (err) {

                } else {
                    Graphic.count({name: {$regex: search}}, function (err, grapCount) {
                        if (err) {

                        } else {
                            let page = parseInt(req.query.page)
                            if (page < 0) {
                                page = 0
                            }
                            let result = search
                            let limit = 3
                            let skip = 0
                            let pages = Math.ceil(Math.max(litCount, grapCount) / 3)
                            skip = page * limit || 0
                            let currentPage = page || 0
                            Literature.find({name: {$regex: search, $options: 'i'}}).skip(skip).limit(limit).populate('author').then(literature => {
                                Graphic.find({name: {$regex: search, $options: 'i'}}).skip(skip).limit(limit).populate('author').then(graphics => {
                                    graphics.page = 0
                                    res.render('search/search', {literature: literature, graphics, pages, currentPage, result})
                                })
                            })
                        }
                    })
                }
            })
        }
    }
}