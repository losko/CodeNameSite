const Comment = require('mongoose').model('Comment')
const Literature = require('mongoose').model('Literature')

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
                    literature.comments.push(comment.id)
                    literature.save()
                })
                req.user.save(err => {
                    if (err) {
                        res.redirect('/', {error: err.message})
                    } else {
                        res.redirect('/literature/details/'+id)
                    }
                })
            })

    },
    editGet: (req, res) => {
        "use strict";
        let id = req.params.id
        Literature.findById(id).populate('author').then(literature => {
            console.log(literature);
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