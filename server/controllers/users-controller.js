let encryption = require('../utilities/encryption')
let User = require('mongoose').model('User')
module.exports = {
    register: (req, res) => {
        "use strict";
        res.render('users/register')
    },
    create: (req, res) => {
        let user = req.body

        if (user.password !== user.confirmPassword) {
            user.globalError = 'Passwords do not match!'
            res.render('users/register', user)
        } else {
            user.salt = encryption.generateSalt()
            user.hashedPass = encryption.generateHashedPassword(user.salt, user.password)

            User
                .create(user)
                .then(user => {
                    "use strict";
                    req.logIn(user, (err, user) => {
                        if (err) {
                            res.render('users/register', { globalError: 'Ooops 500' })
                            return
                        }

                        res.redirect('/')
                    })
                })
        }
    }
}