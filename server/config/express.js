const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const multer = require('multer')

module.exports = (config, app) => {
    "use strict";
    app.set('view engine', 'pug')
    app.set('views', config.rootPath + 'server/views')
    app.use(cookieParser())
    app.use(bodyParser.urlencoded({ extended: true}))
    app.use(session({ secret: 'neshto-taino!@#$%', resave: true, saveUninitialized: true}))
    app.use(multer({dest: 'public/uploads',
        limits: { fileSize: 1000000 }
    }).any())
    app.use(function (err, req, res, next) {
        if (err) {
            res.locals.errorMsg = 'File too large'
            console.log(err);
        }
        next()
    })
    app.use(passport.initialize())
    app.use(passport.session())
    app.use((req, res, next) => {
        if (req.user) {
            res.locals.currentUser = req.user
        }
        next()
    })
    app.use(express.static(config.rootPath + 'public'))

}