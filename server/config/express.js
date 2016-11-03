const express = require('express')

module.exports = (config, app) => {
    "use strict";
    app.set('view engine', 'pug')
    app.set('views', config.rootPath + 'server/views')

    app.use(express.static(config.rootPath + 'public'))
}