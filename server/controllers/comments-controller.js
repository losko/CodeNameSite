const Comment = require('mongoose').model('Comment')
const Literature = require('mongoose').model('Literature')
const Graphic = require('mongoose').model('Graphic')

module.exports = {
    commentPost: (req, res) => {
        "use strict";
        let commentArgs = req.body
        commentArgs.author = req.user.id
        Comment.create(commentArgs)
            .then(comment => {
                req.user.comments.push(comment.id)
                let id = commentArgs.target
                Literature.findById(id).then(literature => {
                    if (literature) {
                        literature.comments.push(comment.id)
                        literature.save()
                        req.user.save(err => {
                            if (err) {
                                res.redirect('/', {error: err.message})
                            } else {
                                res.redirect('/literature/details/'+id)
                            }
                        })
                    } else {
                        Graphic.findById(id).then(graphic => {
                            graphic.comments.push(comment.id)
                            graphic.save()
                            req.user.save(err => {
                                if (err) {
                                    res.redirect('/', {error: err.message})
                                } else {
                                    res.redirect('/graphics/details/'+id)
                                }
                            })
                        })
                    }
                })
            })

    },
    editGet: (req, res) => {
        "use strict";
        let id = req.params.id
        Literature.findById(id).populate('author').then(literature => {
            Comment.find({target: id}).populate('author').then(comments => {
                literature.comments = comments

                res.render('literature/details', literature)
            })
        })
    },
    editPost: (req, res) => {
        "use strict";

    },deleteGet: (req, res) => {
        "use strict";

    },
    deletePost: (req, res) => {
        "use strict";

    }
}