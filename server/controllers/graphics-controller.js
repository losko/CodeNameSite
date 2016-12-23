const Graphic = require('mongoose').model('Graphic')
const Comment = require('mongoose').model('Comment')
const multer = require('multer')
let fs = require('fs')


module.exports = {
    graphicGet: (req, res) => {
        "use strict";
        res.render('graphics/create')
    },
    createGraphic: (req, res, err) => {
        "use strict";
        let errorMsg = ''
        if (res.locals.errorMsg) {
            errorMsg = res.locals.errorMsg
            res.render('graphics/create', {globalError: errorMsg})
        } else {
            let image = req.files[0]
            if (image.mimetype === 'image/jpeg' || image.mimetype === 'image/png') {

                fs.rename('public/uploads/' + image.filename, 'public/uploads/' + image.filename + '.png', function (err) {
                    if (err) throw err
                })
            }

            let graphicInput = req.body

            if (!req.isAuthenticated()) {
                errorMsg = 'Not Logged'
            } else if (!graphicInput.name) {
                errorMsg = 'Invalid Name'
            }
            if (!image) {
                errorMsg = "Missing Image"
            }
            if (errorMsg) {
                res.render('graphics/create', {globalError: errorMsg})
            }

            graphicInput.author = req.user.id
            graphicInput.category = req.body.category.toString()
            graphicInput.image = '/uploads/' + image.filename
            graphicInput.views = 0
            let today = new Date()
            let dd = today.getDate()
            let mm = today.getMonth()+1; //January is 0!
            let yyyy = today.getFullYear();
            let hh = today.getHours()
            let m = today.getMinutes()
            let ss = today.getSeconds()

            if(dd<10) {
                dd='0'+dd
            }

            if(mm<10) {
                mm='0'+mm
            }

            today = mm+'-'+dd+'-'+yyyy+' / '+hh+':'+m+':'+ss;
            graphicInput.date = today
            Graphic.create(graphicInput)
                .then(graphic => {
                    req.user.graphics.push(graphic.id)
                    req.user.save(err => {
                        if (err) {
                            res.redirect('/', {error: err.message})
                        } else {
                            res.redirect('/')
                        }
                    })
                })
        }

    },
    index: (req, res) => {
        "use strict";
        Graphic.count({}, function (err, grapCount) {
            if (err) {

            } else {
                if (req.session.skip !== undefined) {
                    let limit = 6
                    let skip = 0
                    let pages = Math.ceil( grapCount / 6)
                    skip = parseInt(req.query.page) * limit
                    let currentPage = parseInt(req.query.page) || 0
                    Graphic.find({}).skip(skip).limit(limit).populate('author').then(graphics => {
                        graphics.page = 0
                        res.render('graphics/index', {graphics: graphics, pages, currentPage})
                    })
                } else {
                    let limit = 6
                    let skip = 0
                    let pages = Math.ceil(grapCount / 6)
                    req.session.skip = 0
                    let currentPage = 0
                    Graphic.find({}).skip(skip).limit(limit).populate('author').then(graphics => {
                        graphics.page = 0
                        res.render('graphics/index', {graphics: graphics, pages, currentPage})
                    })

                }
            }
        })
    },

    graphicDetails: (req, res) => {
        "use strict";
        let id = req.params.id;

        Graphic.findById(id).populate('author').then(graphic => {
            graphic.views++
            graphic.save()
            Comment.find({target: id}).populate('author').then(comments => {
                graphic.comments = comments
                res.render('graphics/details', graphic)
            })
        })
    },
    graphicDetailsReal: (req, res) => {
        "use strict";
        let id = req.params.id;
        Graphic.findById(id).populate('author').then(graphic => {

            let path = 'public/' + graphic.image + '.png'
            graphic.views++
            graphic.save()
            Comment.find({target: id}).populate('author').then(comments => {
                graphic.comments = comments
                res.render('graphics/detailsReal', graphic)
                //res.download(path)
            })
        })
    },
    downloadPost: (req, res) => {
        "use strict";
        let id = req.params.id;
        Graphic.findById(id).then(graphic => {
            let path = 'public/' + graphic.image + '.png'
            res.download(path)
        })
    },
    editGet: (req, res) => {
        "use strict";
        let id = req.params.id
        let isUser = req.user.username
        Graphic.findById(id).populate('author').then(graphic => {
            console.log(graphic.author.username);
            if (isUser === graphic.author.username || isUser === 'Admin') {
                res.render('graphics/edit', graphic)
            } else {
                res.redirect('/users/login')
            }

        })
    },

    editPost: (req, res) => {
        "use strict";
        let id = req.params.id

        let graphicArgs = req.body
        let errorMsg = ''
        if (!graphicArgs.name) {
            errorMsg = 'Graphic name cannot be empty'
        }

        if (errorMsg) {
            res.render('Graphics/details', {globalError: errorMsg})
        } else {
            Graphic.update({_id: id}, {
                $set: {
                    name: graphicArgs.name,
                    category: graphicArgs.category,
                    description: graphicArgs.description
                }
            })
                .then(updateStatus => {
                    res.redirect(`/graphics/details/${id}`)
                })
        }
    },
    deleteGet: (req, res) => {
        "use strict";
        let id = req.params.id
        let isUser = req.user.username
        Graphic.findById(id).populate('author').then(graphic => {
            if (isUser === graphic.author.username || isUser === 'Admin') {
                res.render('graphics/delete', graphic)
            } else {
                res.redirect('/users/login')
            }
        })
    },

    deletePost: (req, res) => {
        "use strict";
        let id = req.params.id
        Graphic.findOneAndRemove({_id: id}).populate('author').then(graphic => {
            let lifePath = 'public' + graphic.image + '.png'
            fs.unlinkSync(lifePath)
            graphic.prepareDelete()

            res.redirect('/')
        })
    },
    photographyGet: (req, res) => {
        "use strict";
        Graphic.count({category: "Photography"}, function (err, grapCount) {
            if (err) {

            } else {
                if (req.session.skip !== undefined) {
                    let limit = 6
                    let skip = 0
                    let pages = Math.ceil( grapCount / 6)
                    skip = parseInt(req.query.page) * limit
                    let currentPage = parseInt(req.query.page) || 0
                    Graphic.find({category: "Photography"}).skip(skip).limit(limit).populate('author').then(graphics => {
                        graphics.page = 0
                        res.render('graphics/photography', {graphics: graphics, pages, currentPage})
                    })
                } else {
                    let limit = 6
                    let skip = 0
                    let pages = Math.ceil(grapCount / 6)
                    req.session.skip = 0
                    let currentPage = 0
                    Graphic.find({category: "Photography"}).skip(skip).limit(limit).populate('author').then(graphics => {
                        graphics.page = 0
                        res.render('graphics/photography', {graphics: graphics, pages, currentPage})
                    })

                }
            }
        })
    },

    drawingGet: (req, res) => {
        "use strict";
        Graphic.count({category: "Drawing"}, function (err, grapCount) {
            if (err) {

            } else {
                if (req.session.skip !== undefined) {
                    let limit = 6
                    let skip = 0
                    let pages = Math.ceil( grapCount / 6)
                    skip = parseInt(req.query.page) * limit
                    let currentPage = parseInt(req.query.page) || 0
                    Graphic.find({category: "Drawing"}).skip(skip).limit(limit).populate('author').then(graphics => {
                        graphics.page = 0
                        res.render('graphics/Drawing', {graphics: graphics, pages, currentPage})
                    })
                } else {
                    let limit = 6
                    let skip = 0
                    let pages = Math.ceil(grapCount / 6)
                    req.session.skip = 0
                    let currentPage = 0
                    Graphic.find({category: "Drawing"}).skip(skip).limit(limit).populate('author').then(graphics => {
                        graphics.page = 0
                        res.render('graphics/Drawing', {graphics: graphics, pages, currentPage})
                    })

                }
            }
        })
    },

    threeDmodelsGet: (req, res) => {
        "use strict";
        Graphic.count({category: "3D Models"}, function (err, grapCount) {
            if (err) {

            } else {
                if (req.session.skip !== undefined) {
                    let limit = 6
                    let skip = 0
                    let pages = Math.ceil( grapCount / 6)
                    skip = parseInt(req.query.page) * limit
                    let currentPage = parseInt(req.query.page) || 0
                    Graphic.find({category: "3D Models"}).skip(skip).limit(limit).populate('author').then(graphics => {
                        graphics.page = 0
                        res.render('graphics/threeDmodels', {graphics: graphics, pages, currentPage})
                    })
                } else {
                    let limit = 6
                    let skip = 0
                    let pages = Math.ceil(grapCount / 6)
                    req.session.skip = 0
                    let currentPage = 0
                    Graphic.find({category: "3D Models"}).skip(skip).limit(limit).populate('author').then(graphics => {
                        graphics.page = 0
                        res.render('graphics/threeDmodels', {graphics: graphics, pages, currentPage})
                    })

                }
            }
        })
    },

    otherGet: (req, res) => {
        "use strict";
        Graphic.count({category: "Other"}, function (err, grapCount) {
            if (err) {

            } else {
                if (req.session.skip !== undefined) {
                    let limit = 6
                    let skip = 0
                    let pages = Math.ceil( grapCount / 6)
                    skip = parseInt(req.query.page) * limit
                    let currentPage = parseInt(req.query.page) || 0
                    Graphic.find({category: "Other"}).skip(skip).limit(limit).populate('author').then(graphics => {
                        graphics.page = 0
                        res.render('graphics/other', {graphics: graphics, pages, currentPage})
                    })
                } else {
                    let limit = 6
                    let skip = 0
                    let pages = Math.ceil(grapCount / 6)
                    req.session.skip = 0
                    let currentPage = 0
                    Graphic.find({category: "Other"}).skip(skip).limit(limit).populate('author').then(graphics => {
                        graphics.page = 0
                        res.render('graphics/other', {graphics: graphics, pages, currentPage})
                    })

                }
            }
        })
    },
}
