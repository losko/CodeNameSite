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
            res.render('literature/create', {globalError: errorMsg})
            return
        }

        literatureInput.author = req.user.id
        literatureInput.category = req.body.category.toString()
        literatureInput.views = 0
        literatureInput.content = literatureInput.content.replace(/\r?\n/g, '<br />')
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
        literatureInput.date = today
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
            literature.views++
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
        let isUser = req.user.username
        Literature.findById(id).populate('author').then(literature => {
            if (isUser === literature.author.username || isUser === 'Admin') {
                literature.content = literature.content.replace(/<br \/>/g, '\r\n')
                res.render('literature/edit', literature)
            } else {
                res.redirect('/users/login')
            }
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
            literatureArgs.content = literatureArgs.content.replace(/\r?\n/g, '<br />')
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
        let isUser = req.user.username
        Literature.findById(id).populate('author').then(literature => {
            if (isUser === literature.author.username || isUser === 'Admin') {
                literature.content = literature.content.replace(/<br \/>/g, '\r\n')
                res.render('literature/delete', literature)
            } else {
                res.redirect('/users/login')
            }

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
        Literature.count({}, function (err, litCount) {
            if (err) {

            } else {
                if (req.session.skip !== undefined) {
                    let limit = 6
                    let skip = 0
                    let pages = Math.ceil( litCount / 6)
                    skip = parseInt(req.query.page) * limit
                    let currentPage = parseInt(req.query.page) || 0
                    Literature.find({}).skip(skip).limit(limit).populate('author').then(literature => {
                        literature.page = 0
                        res.render('literature/index', {literatures: literature, pages, currentPage})
                    })
                } else {
                    let limit = 6
                    let skip = 0
                    let pages = Math.ceil(litCount / 6)
                    req.session.skip = 0
                    let currentPage = 0
                    Literature.find({}).skip(skip).limit(limit).populate('author').then(literature => {
                        literature.page = 0
                        res.render('literature/index', {literatures: literature, pages, currentPage})
                    })

                }
            }
        })
    },

    poetryGet: (req, res) => {
        "use strict";
        Literature.count({category: "Poetry"}, function (err, litCount) {
            if (err) {

            } else {
                if (req.session.skip !== undefined) {
                    let limit = 6
                    let skip = 0
                    let pages = Math.ceil( litCount / 6)
                    skip = parseInt(req.query.page) * limit
                    let currentPage = parseInt(req.query.page) || 0
                    Literature.find({category: "Poetry"}).skip(skip).limit(limit).populate('author').then(literature => {
                        literature.page = 0
                        res.render('literature/poetry', {literatures: literature, pages, currentPage})
                    })
                } else {
                    let limit = 6
                    let skip = 0
                    let pages = Math.ceil(litCount / 6)
                    req.session.skip = 0
                    let currentPage = 0
                    Literature.find({category: "Poetry"}).skip(skip).limit(limit).populate('author').then(literature => {
                        literature.page = 0
                        res.render('literature/poetry', {literatures: literature, pages, currentPage})
                    })

                }
            }
        })
    },

    poemsGet: (req, res) => {
        "use strict";
        Literature.count({category: "Poems"}, function (err, litCount) {
            if (err) {

            } else {
                if (req.session.skip !== undefined) {
                    let limit = 6
                    let skip = 0
                    let pages = Math.ceil( litCount / 6)
                    skip = parseInt(req.query.page) * limit
                    let currentPage = parseInt(req.query.page) || 0
                    Literature.find({category: "Poems"}).skip(skip).limit(limit).populate('author').then(literature => {
                        literature.page = 0
                        res.render('literature/poems', {literatures: literature, pages, currentPage})
                    })
                } else {
                    let limit = 6
                    let skip = 0
                    let pages = Math.ceil(litCount / 6)
                    req.session.skip = 0
                    let currentPage = 0
                    Literature.find({category: "Poems"}).skip(skip).limit(limit).populate('author').then(literature => {
                        literature.page = 0
                        res.render('literature/poems', {literatures: literature, pages, currentPage})
                    })

                }
            }
        })
    },

    novelsGet: (req, res) => {
        "use strict";
        Literature.count({category: "Novels"}, function (err, litCount) {
            if (err) {

            } else {
                if (req.session.skip !== undefined) {
                    let limit = 6
                    let skip = 0
                    let pages = Math.ceil( litCount / 6)
                    skip = parseInt(req.query.page) * limit
                    let currentPage = parseInt(req.query.page) || 0
                    Literature.find({category: "Novels"}).skip(skip).limit(limit).populate('author').then(literature => {
                        literature.page = 0
                        res.render('literature/novels', {literatures: literature, pages, currentPage})
                    })
                } else {
                    let limit = 6
                    let skip = 0
                    let pages = Math.ceil(litCount / 6)
                    req.session.skip = 0
                    let currentPage = 0
                    Literature.find({category: "Novels"}).skip(skip).limit(limit).populate('author').then(literature => {
                        literature.page = 0
                        res.render('literature/novels', {literatures: literature, pages, currentPage})
                    })

                }
            }
        })
    },

    otherGet: (req, res) => {
        "use strict";
        Literature.count({category: "Other"}, function (err, litCount) {
            if (err) {

            } else {
                if (req.session.skip !== undefined) {
                    let limit = 6
                    let skip = 0
                    let pages = Math.ceil( litCount / 6)
                    skip = parseInt(req.query.page) * limit
                    let currentPage = parseInt(req.query.page) || 0
                    Literature.find({category: "Other"}).skip(skip).limit(limit).populate('author').then(literature => {
                        literature.page = 0
                        res.render('literature/other', {literatures: literature, pages, currentPage})
                    })
                } else {
                    let limit = 6
                    let skip = 0
                    let pages = Math.ceil(litCount / 6)
                    req.session.skip = 0
                    let currentPage = 0
                    Literature.find({category: "Other"}).skip(skip).limit(limit).populate('author').then(literature => {
                        literature.page = 0
                        res.render('literature/other', {literatures: literature, pages, currentPage})
                    })

                }
            }
        })
    }
}
