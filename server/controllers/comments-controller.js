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
                        comment.targetType = 'L'
                        comment.save()
                        literature.comments.push(comment.id)
                        literature.save()
                        req.user.save(err => {
                            if (err) {
                                res.redirect('/', {error: err.message})
                            } else {
                                res.redirect('/literature/details/' + id)
                            }
                        })
                    } else {
                        Graphic.findById(id).then(graphic => {
                            comment.targetType = 'G'
                            comment.save()
                            graphic.comments.push(comment.id)
                            graphic.save()
                            req.user.save(err => {
                                if (err) {
                                    res.redirect('/', {error: err.message})
                                } else {
                                    res.redirect('/graphics/details/' + id)
                                }
                            })
                        })
                    }
                })
            })

    },
    editGet: (req, res) => {
        "use strict";
        let id = req.params._id
        Comment.findById(id).then(comment => {
            res.render('comments/edit', comment)
        })

    },
    editPost: (req, res) => {
        "use strict";
        let id = req.params._id
        let commentArgs = req.body
        let errorMsg = ''
        if (!commentArgs.comment) {
            errorMsg = 'Comment name cannot be empty'
        }

        if (errorMsg) {
            res.render('/', {globalError: errorMsg})
        } else {
            Comment.update({_id: id}, {
                $set: {
                    comment: commentArgs.comment
                }
            })
                .then(updateStatus => {
                    res.redirect('/')
                })
        }
    },
    deleteGet: (req, res) => {
        "use strict";
        let id = req.params._id
        Comment.findById(id).then(comment => {
            res.render('comments/delete', comment)
        })

    },
    deletePost: (req, res) => {
        "use strict";
        let id = req.params._id
        Comment.findOneAndRemove({_id: id}).populate('author').then(comment => {
            comment.prepareDelete()
            res.redirect('/')
        })
    }
}