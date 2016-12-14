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
            res.render('graphics/create', { globalError: errorMsg })
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
                res.render('graphics/create', { globalError: errorMsg })
            }

            graphicInput.author = req.user.id
            graphicInput.category = req.body.category.toString()
            graphicInput.image = '/uploads/' + image.filename
            graphicInput.views = 0
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
        Graphic.find({}).populate('author')
            .then(graphics => {
                res.render('graphics/index', {graphics: graphics})
            })
    },

    graphicDetails: (req, res) => {
        "use strict";
        let id = req.params.id;

        Graphic.findById(id).populate('author').then(graphic => {
            graphic.views ++
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

            let path = 'public/'+graphic.image+'.png'
            graphic.views ++
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
            let path = 'public/'+graphic.image+'.png'
            res.download(path)
        })
    },
    editGet: (req, res) => {
        "use strict";
        let id = req.params.id

        Graphic.findById(id).then(graphic => {
            res.render('graphics/edit', graphic)
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
            res.render('Graphics/details', { globalError: errorMsg })
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

        Graphic.findById(id).then(graphic => {
            res.render('graphics/delete', graphic)
        })
    },

    deletePost: (req, res) => {
        "use strict";
        let id = req.params.id
        Graphic.findOneAndRemove({_id: id}).populate('author').then(graphic => {
            let lifePath = 'public'+graphic.image+'.png'
            fs.unlinkSync(lifePath)
            graphic.prepareDelete()

            res.redirect('/')
        })
    },
    photographyGet: (req, res) => {
        "use strict";
        Graphic.find({category: "Photography"}).populate('author')
            .then(photography => {
                res.render('graphics/photography', {graphics: photography})
            })
    },

    drawingGet: (req, res) => {
        "use strict";
        Graphic.find({category: "Drawing"}).populate('author')
            .then(drawing => {
                res.render('graphics/drawing', {graphics: drawing})
            })
    },

    threeDmodelsGet: (req, res) => {
        "use strict";
        Graphic.find({category: "3D Models"}).populate('author')
            .then(threeDmodels => {
                res.render('graphics/threeDmodels', {graphics: threeDmodels})
            })
    },

    otherGet: (req, res) => {
        "use strict";
        Graphic.find({category: "Other"}).populate('author')
            .then(others => {
                res.render('graphics/other', {graphics: others})
            })
    },
}
