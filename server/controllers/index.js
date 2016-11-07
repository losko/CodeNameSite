let homeController = require('./home-controller')
let usersController = require('./users-controller')
let articlesController = require('./articles-controller')
let createContentController = require('./createContent-controller')

module.exports = {
    home:homeController,
    users: usersController,
    articles: articlesController,
    createContent: createContentController
}