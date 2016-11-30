const controllers = require('../controllers')
const auth = require('../config/auth')

module.exports = (app) => {
    "use strict";
    app.get('/', controllers.home.index)
    app.get('/about', controllers.home.about)

    app.get('/users/register', controllers.users.register)
    app.post('/users/create', controllers.users.create)
    app.get('/users/login', controllers.users.login)
    app.post('/users/authenticate', controllers.users.authenticate)
    app.post('/users/logout', controllers.users.logout)

    app.get('/articles/create',auth.isAuthenticated, controllers.articles.create)

    /*app.get('/graphics/create',auth.isAuthenticated, controllers.graphics.graphics)*/

    app.get('/literature/create',auth.isAuthenticated, controllers.literatures.literatureGet)
    app.post('/literature/create',auth.isAuthenticated, controllers.literatures.createLiterature)

    app.get('/literature/details/:id', controllers.literatures.literatureDetails)

    app.get('/literature/edit/:id',auth.isAuthenticated, controllers.literatures.editGet)
    app.post('/literature/edit/:id',auth.isAuthenticated, controllers.literatures.editPost)



    app.all('*', (req, res) => {
        res.status(404)
        res.send('Not Found')
        res.end()
    })
}
