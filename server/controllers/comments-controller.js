const Comment = require('mongoose').model('Comment')
const Literature = require('mongoose').model('Literature')
const Graphic = require('mongoose').model('Graphic')

module.exports = {
    commentPost: (req, res) => {
        "use strict";
        let commentArgs = req.body
        commentArgs.author = req.user.id
        commentArgs.comment = commentArgs.comment.replace(/\r?\n/g, '<br />')
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
        Comment.create(commentArgs)
            .then(comment => {
                req.user.comments.push(comment.id)
                let id = commentArgs.target
                Literature.findById(id).then(literature => {
                    if (literature) {
                        comment.targetType = 'L'
                        comment.date = today
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
                            comment.date = today
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
            comment.comment = comment.comment.replace(/<br \/>/g, '\r\n')
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
            Comment.findById(id).then(comment => {
                commentArgs.comment = commentArgs.comment.replace(/\r?\n/g, '<br />')
                Comment.update({_id: id}, {
                    $set: {
                        comment: commentArgs.comment
                    }
                })
                    .then(updateStatus => {
                        if (comment.targetType === 'L') {
                            res.redirect('/literature/details/'+comment.target)
                        } else {
                            res.redirect('/graphics/details/'+comment.target)
                        }

                    })
            })
        }
    },
    deleteGet: (req, res) => {
        "use strict";
        let id = req.params._id
        Comment.findById(id).then(comment => {
            comment.comment = comment.comment.replace(/<br \/>/g, '\r\n')
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