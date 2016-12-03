let mongoose = require('mongoose')

mongoose.Promise = global.Promise

module.exports = (config) => {
    "use strict";
    mongoose.connect(config.db)

    let db = mongoose.connection

    db.once('open', err => {
        if (err) {
            console.log(err)
        }

        console.log('MondoDB ready!');
    })

    db.on('error', err => console.log('Database error: ' + err))

    require('../data/User').seedAdminUser()
    require('../data/Literature')
    require('../data/Comment')
    /*require('../data/Graphic')*/
}
