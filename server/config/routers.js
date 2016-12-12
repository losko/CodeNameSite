const controllers = require('../controllers')
const auth = require('../config/auth')
const adminController = require('../controllers/admin/admin-controller')

module.exports = (app) => {
    "use strict";
    app.get('/', controllers.home.index)

    app.get('/literature/index', controllers.literatures.index)
    app.get('/literature/poetry', controllers.literatures.poetryGet)
    app.get('/literature/poems', controllers.literatures.poemsGet)
    app.get('/literature/novels', controllers.literatures.novelsGet)
    app.get('/literature/other', controllers.literatures.otherGet)

    app.get('/graphics/index', controllers.graphics.index)
    app.get('/graphics/photography', controllers.graphics.photographyGet)
    app.get('/graphics/drawing', controllers.graphics.drawingGet)
    app.get('/graphics/threeDmodels', controllers.graphics.threeDmodelsGet)
    app.get('/graphics/other', controllers.graphics.otherGet)

    app.post('/literature/search', controllers.literatures.searchPost)

    app.get('/about', controllers.home.about)

    app.get('/users/register', controllers.users.register)
    app.post('/users/create', controllers.users.create)
    app.get('/users/login', controllers.users.login)
    app.post('/users/authenticate', controllers.users.authenticate)
    app.post('/users/logout', controllers.users.logout)

    app.get('/articles/create', auth.isAuthenticated, controllers.articles.create)

    app.get('/graphics/create',auth.isAuthenticated,  controllers.graphics.graphicGet)
    app.post('/graphics/create',auth.isAuthenticated,  controllers.graphics.createGraphic)

    app.get('/graphics/index', controllers.graphics.index)

    app.get('/graphics/details/:id', controllers.graphics.graphicDetails)

    app.get('/graphics/edit/:id', auth.isAuthenticated, controllers.graphics.editGet)
    app.post('/graphics/edit/:id', auth.isAuthenticated, controllers.graphics.editPost)

    app.get('/graphics/delete/:id', auth.isAuthenticated, controllers.graphics.deleteGet)
    app.post('/graphics/delete/:id', auth.isAuthenticated, controllers.graphics.deletePost)

    app.get('/literature/create', auth.isAuthenticated, controllers.literatures.literatureGet)
    app.post('/literature/create', auth.isAuthenticated, controllers.literatures.createLiterature)

    app.get('/literature/details/:id', controllers.literatures.literatureDetails)

    app.post('/comments/create', auth.isAuthenticated, controllers.comment.commentPost)

    app.get('/comment/edit/:id', auth.isAuthenticated, controllers.comment.editGet)
    app.post('/comment/edit/:id', auth.isAuthenticated, controllers.comment.editPost)

    app.get('/comment/delete/:id', auth.isAuthenticated, controllers.comment.deletePost)
    app.post('/comment/delete/:id', auth.isAuthenticated, controllers.comment.deletePost)

    app.get('/literature/edit/:id', auth.isAuthenticated, controllers.literatures.editGet)
    app.post('/literature/edit/:id', auth.isAuthenticated, controllers.literatures.editPost)

    app.get('/literature/delete/:id', auth.isAuthenticated, controllers.literatures.deleteGet)
    app.post('/literature/delete/:id', auth.isAuthenticated, controllers.literatures.deletePost)


    app.get('/admin/user/all', auth.isInRole('Admin'), adminController.user.all)

    app.all('*', (req, res) => {
        res.status(404)
        res.send('Not Found')
        res.end()
    })
}
