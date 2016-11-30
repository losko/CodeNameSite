const User = require('mongoose').model('User')

module.exports = {
    all: (req, res) => {
        "use strict";
        User.find({}).then(users => {

            res.render('admin/user/all', {users: users})
        })
    }
}