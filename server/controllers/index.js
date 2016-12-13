let homeController = require('./home-controller')
let usersController = require('./users-controller')
let articlesController = require('./articles-controller')
let literatureController = require('./literatures-controller')
let commentController = require('./comments-controller')
let graphicController = require('./graphics-controller')
let searchController = require('./search-controller')

module.exports = {
    home: homeController,
    users: usersController,
    articles: articlesController,
    literatures: literatureController,
    comment: commentController,
    graphics: graphicController,
    search: searchController,
}