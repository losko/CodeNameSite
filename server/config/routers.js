let controllers = require('../controllers')

module.exports = (app) => {
    "use strict";
    app.get('/', controllers.home.index)
    app.get('/about', controllers.home.about)

    app.get('/users/register', controllers.users.register)
    app.post('/users/create', controllers.users.create)

    app.all('*', (req, res) => {
        res.status(404)
        res.send('Not Found')
        res.end()
    })
}
