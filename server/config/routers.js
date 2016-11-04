module.exports = (app) => {
    "use strict";
    app.get('/', (req, res) => {
        mongoose.connect(config.db)
        res.render('index')
    })

    app.all('*', (req, res) => {
        res.status(404)
        res.send('Not Found')
        res.end()
    })
}
