const Literature = require('mongoose').model('Literature')

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
            console.log('Not logged')
        } else if (!literatureInput.name) {
            console.log('Invalid name')
        } else if (!literatureInput.content) {
            console.log('Invalid Content')
        } else if (!literatureInput.description) {
            console.log('Invalid Description')
        }

        if (errorMsg) {
            res.render('literature/create', { error: errorMsg })
            return
        }

        literatureInput.author = req.user.id
        literatureInput.category = req.body.category.toString()
        Literature.create(literatureInput)
            .then(literature => {
                req.user.literature.push(literature.id)
                req.user.save(err => {
                    if (err) {
                        res.redirect('/', { error: err.message })
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
            res.render('literature/details', literature)

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
            Literature.update({_id: id}, {$set: {name: literatureArgs.name, content: literatureArgs.content, category: literatureArgs.category, description: literatureArgs.description}})
                .then(updateStatus => {
                    res.redirect(`/literature/details/${id}`)
                })
        }
    }
}
