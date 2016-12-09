const Graphic = require('mongoose').model('Graphic')
const Comment = require('mongoose').model('Comment')

module.exports = {
    graphicGet: (req, res) => {
        "use strict";
        res.render('graphics/create')
    },

    createGraphic: (req, res) => {
        "use strict";
        let graphicInput = req.body

        let errorMsg = ''

        if (!req.isAuthenticated()) {
            console.log('Not logged')
        } else if (!graphicInput.name) {
            console.log('Invalid name')
        } else if (!graphicInput.content) {
            console.log('Invalid Content')
        } else if (!graphicInput.description) {
            console.log('Invalid Description')
        }

        if (errorMsg) {
            res.render('literature/create', {error: errorMsg})
            return
        }

        graphicInput.author = req.user.id
        graphicInput.category = req.body.category.toString()
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
}
