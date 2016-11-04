let controllers = require('../controllers')

module.exports = (app) => {
    "use strict";
    app.get('/', controllers.home.index)
    app.get('/about', controllers.home.about)

    app.all('*', (req, res) => {
        res.status(404)
        res.send('Not Found')
        res.end()
    })
}
