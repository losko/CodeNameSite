module.exports = {
    isAuthenticated: (req, res, next) => {
        "use strict";
        if (req.isAuthenticated()) {
            next()
        } else {
            res.redirect('/users/login')
        }
    },
    isInRole: (role) => {
        "use strict";
        return (req, res, next) => {
            if (req.user && req.user.roles.indexOf(role) > -1) {
                next()
            } else {
                res.redirect('/users/login')
            }
        }
    }
}