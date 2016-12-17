const controllers = require('../controllers')
const auth = require('../config/auth')
const adminController = require('../controllers/admin/admin-controller')

module.exports = (app) => {
    "use strict";
    //Home Routes
    app.get('/:page', controllers.home.index)
    app.get('/', controllers.home.index)

    app.get('/about', controllers.home.about)

    //Search Routes
    app.get('/search/search/:page', controllers.search.searchGet)
    app.get('/search/search', controllers.search.searchGet)


    //User Routes
    app.get('/users/register', controllers.users.register)
    app.post('/users/create', controllers.users.create)

    app.get('/users/login', controllers.users.login)
    app.post('/users/authenticate', controllers.users.authenticate)

    app.get('/users/profile/:id', auth.isAuthenticated, controllers.users.profileGet)

    app.get('/users/edit/:id', auth.isAuthenticated, controllers.users.editGet)
    app.post('/users/edit/:id', auth.isAuthenticated, controllers.users.editPost)

    app.post('/users/logout', controllers.users.logout)

    //Unused Routes
    app.get('/articles/create', auth.isAuthenticated, controllers.articles.create)

    //Graphics Routes
    app.get('/graphics/index/:page', controllers.graphics.index)
    app.get('/graphics/index', controllers.graphics.index)

    app.get('/graphics/photography/:page', controllers.graphics.photographyGet)
    app.get('/graphics/photography', controllers.graphics.photographyGet)

    app.get('/graphics/drawing/:page', controllers.graphics.drawingGet)
    app.get('/graphics/drawing', controllers.graphics.drawingGet)

    app.get('/graphics/threeDmodels/:page', controllers.graphics.threeDmodelsGet)
    app.get('/graphics/threeDmodels', controllers.graphics.threeDmodelsGet)

    app.get('/graphics/other/:page', controllers.graphics.otherGet)
    app.get('/graphics/other', controllers.graphics.otherGet)

    app.post('/graphics/download/:id', controllers.graphics.downloadPost)

    app.get('/graphics/create',auth.isAuthenticated,  controllers.graphics.graphicGet)
    app.post('/graphics/create',auth.isAuthenticated,  controllers.graphics.createGraphic)


    app.get('/graphics/details/:id', controllers.graphics.graphicDetails)
    app.get('/graphics/detailsReal/:id', controllers.graphics.graphicDetailsReal)

    app.get('/graphics/edit/:id', auth.isAuthenticated, controllers.graphics.editGet)
    app.post('/graphics/edit/:id', auth.isAuthenticated, controllers.graphics.editPost)

    app.get('/graphics/delete/:id', auth.isAuthenticated, controllers.graphics.deleteGet)
    app.post('/graphics/delete/:id', auth.isAuthenticated, controllers.graphics.deletePost)

    //Literature Routes
    app.get('/literature/index/:page', controllers.literatures.index)
    app.get('/literature/index', controllers.literatures.index)

    app.get('/literature/poetry/:page', controllers.literatures.poetryGet)
    app.get('/literature/poetry', controllers.literatures.poetryGet)

    app.get('/literature/poems/:page', controllers.literatures.poemsGet)
    app.get('/literature/poems', controllers.literatures.poemsGet)

    app.get('/literature/novels/:page', controllers.literatures.novelsGet)
    app.get('/literature/novels', controllers.literatures.novelsGet)

    app.get('/literature/other/:page', controllers.literatures.otherGet)
    app.get('/literature/other', controllers.literatures.otherGet)

    app.get('/literature/create', auth.isAuthenticated, controllers.literatures.literatureGet)
    app.post('/literature/create', auth.isAuthenticated, controllers.literatures.createLiterature)

    app.get('/literature/details/:id', controllers.literatures.literatureDetails)

    app.get('/literature/edit/:id', auth.isAuthenticated, controllers.literatures.editGet)
    app.post('/literature/edit/:id', auth.isAuthenticated, controllers.literatures.editPost)

    app.get('/literature/delete/:id', auth.isAuthenticated, controllers.literatures.deleteGet)
    app.post('/literature/delete/:id', auth.isAuthenticated, controllers.literatures.deletePost)

    //Comments Routes
    app.post('/comments/create', auth.isAuthenticated, controllers.comment.commentPost)

    app.get('/comment/edit/:_id', auth.isAuthenticated, controllers.comment.editGet)
    app.post('/comment/edit/:_id', auth.isAuthenticated, controllers.comment.editPost)

    app.get('/comment/delete/:_id', auth.isAuthenticated, controllers.comment.deleteGet)
    app.post('/comment/delete/:_id', auth.isAuthenticated, controllers.comment.deletePost)

    //Admin routes
    app.get('/admin/user/all', auth.isInRole('Admin'), adminController.user.all)

    app.get('/admin/user/edit/:id', auth.isInRole('Admin'), adminController.user.editGet)
    app.post('/admin/user/edit/:id', auth.isInRole('Admin'), adminController.user.editPost)

    app.get('/admin/user/delete/:id', auth.isInRole('Admin'), adminController.user.deleteGet)
    app.post('/admin/user/delete/:id', auth.isInRole('Admin'), adminController.user.deletePost)

    //Wrong Routes
    app.all('*', (req, res) => {
        res.status(404)
        res.send('Not Found')
        res.end()
    })
}
