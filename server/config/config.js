const path = require('path')

let rootPath = path.normalize(path.join(__dirname, '/../../'))


module.exports = {
    development: {
        rootPath: rootPath,
        db: 'mongodb://localhost:27017/codeNameSite',
        port: 80
    },
    production: {
        rootPath: rootPath,
        db: process.env.MONGO_DB_CONN_STRING,
        port: process.env.port
    }
}