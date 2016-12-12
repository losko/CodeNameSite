const Literature = require('mongoose').model('Literature')
const Comment = require('mongoose').model('Comment')

module.exports = {
    literatureGet: (req, res) => {
        "use strict";
        res.render('literature/create')
    },

    createLiterature: (req, res) => {
        "use strict";
        let literatureInput = req.body

        let errorMsg = ''

        if (!req.isAuthenticated()) {
            errorMsg = 'Not logged'
        } else if (!literatureInput.name) {
            errorMsg = 'Invalid name'
        } else if (!literatureInput.content) {
            errorMsg = 'Invalid Content'
        }

        if (errorMsg) {
            res.render('literature/create', { globalError: errorMsg })
            return
        }

        literatureInput.author = req.user.id
        literatureInput.category = req.body.category.toString()
        literatureInput.views = 0
        Literature.create(literatureInput)
            .then(literature => {
                req.user.literature.push(literature.id)
                req.user.save(err => {
                    if (err) {
                        res.redirect('/', {error: err.message})
                    } else {
                        res.redirect('/')
                    }
                })
            })
    },

    literatureDetails: (req, res) => {
        "use strict";
        let id = req.params.id;

        Literature.findById(id).populate('author').then(literature => {
            literature.views ++
            literature.save()
            Comment.find({target: id}).populate('author').then(comments => {
                literature.comments = comments
                res.render('literature/details', literature)
            })
        })
    },

    editGet: (req, res) => {
        "use strict";
        let id = req.params.id

        Literature.findById(id).then(literature => {
            res.render('literature/edit', literature)
        })
    },

    editPost: (req, res) => {
        "use strict";
        let id = req.params.id

        let literatureArgs = req.body
        let errorMsg = ''
        if (!literatureArgs.name) {
            errorMsg = 'Literature name cannot be empty'
        } else if (!literatureArgs.content) {
            errorMsg = 'Literature content cannot be empty'
        }

        if (errorMsg) {
            res.render('literature/edit', {error: errorMsg})
        } else {
            Literature.update({_id: id}, {
                $set: {
                    name: literatureArgs.name,
                    content: literatureArgs.content,
                    category: literatureArgs.category,
                    description: literatureArgs.description
                }
            })
                .then(updateStatus => {
                    res.redirect(`/literature/details/${id}`)
                })
        }
    },

    deleteGet: (req, res) => {
        "use strict";
        let id = req.params.id

        Literature.findById(id).then(literature => {
            res.render('literature/delete', literature)
        })
    },

    deletePost: (req, res) => {
        "use strict";
        let id = req.params.id
        Literature.findOneAndRemove({_id: id}).populate('author').then(literature => {
            literature.prepareDelete()
            res.redirect('/')
        })
    },
    index: (req, res) => {
        "use strict";
        Literature.find({}).populate('author')
            .then(content => {
                res.render('home/index', {content: content})
            })
    },

    poetryGet: (req, res) => {
        "use strict";
        Literature.find({category: "Poetry"}).populate('author')
            .then(poetrys => {
                res.render('literature/poetry', {literatures: poetrys})
            })
    },

    poemsGet: (req, res) => {
        "use strict";
        Literature.find({category: "Poems"}).populate('author')
            .then(poems => {
                res.render('literature/poems', {literatures: poems})
            })
    },

    novelsGet: (req, res) => {
        "use strict";
        Literature.find({category: "Novels"}).populate('author')
            .then(novels => {
                res.render('literature/novels', {literatures: novels})
            })
    },

    otherGet: (req, res) => {
        "use strict";
        Literature.find({category: "Other"}).populate('author')
            .then(others => {
                res.render('literature/other', {literatures: others})
            })
    },

    searchPost: (req, res) => {
        "use strict";
        let search = req.body
        if (search.search === '') {
            Literature.find({}).populate('author')
                .then(search => {
                    res.render('literature/search', {literatures: search})
                })
        } else {
            Literature.find({name: search.search}).populate('author')
                .then(search => {
                    res.render('literature/search', {literatures: search})
                })
        }
    }
}
