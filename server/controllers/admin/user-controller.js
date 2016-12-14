let encryption = require('../../utilities/encryption')
const User = require('mongoose').model('User')

module.exports = {
    all: (req, res) => {
        "use strict";
        User.find({}).then(users => {
            res.render('admin/user/all', {users: users})
        })
    },
    editGet: (req, res) => {
        "use strict";
        let id = req.params.id
        User.findById(id).then(user => {
            res.render('admin/user/edit', user)

        })
    },
    editPost: (req, res) => {
        "use strict";
        let inputUser = req.body
        let id = req.params.id

        User.findById(id).then(user => {
            if (!user) {
                res.render('admin/user/edit', {globalError: 'Invalid username or password', user})
            } else if (inputUser.password !== inputUser.confirmPassword) {
                res.render('admin/user/edit', {globalError: 'Wrong old password', user})
            } else {
                User.find({username: inputUser.username}, function (err, username) {
                    if (err) {
                        console.log('err');
                    } else if (username.username || username[0]) {
                        if (username[0].username !== user.username) {
                            res.render('admin/user/edit', {globalError: 'Username already exist', user})
                        } else if (username[0].username === user.username){
                            User.find({email: inputUser.email}, function (err, email) {
                                if (err) {
                                    console.log('err');
                                } else if (email.email || email[0]) {
                                    if (email[0].email !== user.email) {
                                        res.render('admin/user/edit', {globalError: 'Email already exist', user})
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
                                            res.redirect('/admin/user/all')
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
                                        res.redirect('/admin/user/all')
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
                            res.redirect('/admin/user/all')
                        })
                    }
                })
            }
        })
    },
    deleteGet: (req, res) => {
        "use strict";

    },
    deletePost: (req, res) => {
        "use strict";

    }
}