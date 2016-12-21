let encryption = require('../utilities/encryption')
let User = require('mongoose').model('User')
module.exports = {
    register: (req, res) => {
        "use strict";
        res.render('users/register')
    },
    create: (req, res) => {
        let user = req.body
        User.findOne({username: user.username}, function (err, person) {
            if (err) {

            } else if (person) {
                res.render('users/register', {globalError: 'Username already exist'})
            } else {
                User.findOne({email: user.email}, function (err, email) {
                    if (err) {

                    } else if (email) {
                        res.render('users/register', {globalError: 'Email already exist'})
                    } else {
                        if (user.password !== user.confirmPassword) {
                            user.globalError = 'Passwords do not match!'
                            res.render('users/register', user)
                        } else {
                            user.salt = encryption.generateSalt()
                            user.hashedPass = encryption.generateHashedPassword(user.salt, user.password)

                            User.create(user).then(user => {
                                req.logIn(user, (err) => {
                                    if (err) {
                                        res.render('users/register', {globalError: 'Ooops 500'})
                                        return
                                    }
                                    res.redirect('/')
                                })
                            })
                        }
                    }
                })
                /*if (user.password !== user.confirmPassword) {
                 user.globalError = 'Passwords do not match!'
                 res.render('users/register', user)
                 } else {
                 user.salt = encryption.generateSalt()
                 user.hashedPass = encryption.generateHashedPassword(user.salt, user.password)

                 User.create(user).then(user => {
                 req.logIn(user, (err) => {
                 if (err) {
                 res.render('users/register', {globalError: 'Ooops 500'})
                 return
                 }
                 res.redirect('/')
                 })
                 })
                 }*/
            }


        })


    },
    login: (req, res) => {
        res.render('users/login')
    },

    authenticate: (req, res) => {
        "use strict";
        let inputUser = req.body

        User
            .findOne({username: inputUser.username})
            .then(user => {
                if (!user) {
                    res.render('users/login', {globalError: 'Invalid username or password'})
                } else if (!user.authenticate(inputUser.password)) {
                    res.render('users/login', {globalError: 'Invalid username or password'})
                } else {
                    req.logIn(user, (err, user) => {
                        if (err) {
                            res.render('users/login', {globalError: 'Ooops 500'})
                            return
                        }

                        res.redirect('/')
                    })
                }
            })
    },

    profileGet: (req, res) => {
        "use strict";
        let id = req.params.id;
        User.findById(id).populate('literature graphics comments').then(user => {
            res.render('users/profile', {user: user})
        })
    },

    editGet: (req, res) => {
        "use strict";
        let id = req.params.id
        if (req.user._id == id) {
            User.findById(id).then(user => {
                res.render('users/edit', user)

            })
        } else {
            res.redirect('/')
        }
    },

    editPost: (req, res) => {
        "use strict";
        let inputUser = req.body
        let id = req.params.id

        User.findById(id).then(user => {
            if (!user) {
                res.render('users/edit', {globalError: 'Invalid username or password', user})
            } else if (!user.authenticate(inputUser.oldPassword)) {
                res.render('users/edit', {globalError: 'Wrong old password', user})
            } else if (inputUser.password !== inputUser.confirmPassword) {
                res.render('users/edit', {globalError: 'Wrong old password', user})
            } else {
                User.find({username: inputUser.username}, function (err, username) {
                    if (err) {
                        console.log('err');
                    } else if (username.username || username[0]) {
                        if (username[0].username !== user.username) {
                            res.render('users/edit', {globalError: 'Username already exist', user})
                        } else if (username[0].username === user.username) {
                            User.find({email: inputUser.email}, function (err, email) {
                                if (err) {
                                    console.log('err');
                                } else if (email.email || email[0]) {
                                    if (email[0].email !== user.email) {
                                        res.render('users/edit', {globalError: 'Email already exist', user})
                                    } else if (email[0].email === user.email) {
                                        inputUser.salt = encryption.generateSalt()
                                        inputUser.hashedPass = encryption.generateHashedPassword(inputUser.salt, inputUser.password)
                                        User.update({_id: id}, {
                                            $set: {
                                                salt: inputUser.salt,
                                                hashedPass: inputUser.hashedPass,
                                                username: inputUser.username,
                                                firstName: inputUser.firstName,
                                                lastName: inputUser.lastName
                                            }
                                        }).then(updateStatus => {
                                            res.redirect(`/users/profile/${id}`)
                                        })
                                    }
                                } else {
                                    inputUser.salt = encryption.generateSalt()
                                    inputUser.hashedPass = encryption.generateHashedPassword(inputUser.salt, inputUser.password)
                                    User.update({_id: id}, {
                                        $set: {
                                            salt: inputUser.salt,
                                            hashedPass: inputUser.hashedPass,
                                            username: inputUser.username,
                                            firstName: inputUser.firstName,
                                            lastName: inputUser.lastName,
                                            email: inputUser.email
                                        }
                                    }).then(updateStatus => {
                                        res.redirect(`/users/profile/${id}`)
                                    })
                                }
                            })
                        }

                    } else {
                        inputUser.salt = encryption.generateSalt()
                        inputUser.hashedPass = encryption.generateHashedPassword(inputUser.salt, inputUser.password)
                        User.update({_id: id}, {
                            $set: {
                                salt: inputUser.salt,
                                hashedPass: inputUser.hashedPass,
                                username: inputUser.username,
                                firstName: inputUser.firstName,
                                lastName: inputUser.lastName,
                                email: inputUser.email
                            }
                        }).then(updateStatus => {
                            res.redirect(`/users/profile/${id}`)
                        })
                    }
                })
            }
        })
    },

    logout: (req, res) => {
        "use strict";
        req.logout()
        res.redirect('/')
    }
}