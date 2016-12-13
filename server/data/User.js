const mongoose = require('mongoose')
const encryption = require('../utilities/encryption')

let requiredValidationMessage = '{PATH} is required'

let userSchema = mongoose.Schema({
    username: { type: String, required: requiredValidationMessage, unique: true},
    firstName: { type: String, required: requiredValidationMessage},
    lastName: { type: String, required: requiredValidationMessage},
    email: { type: String, required: requiredValidationMessage, unique: true},
    literature: [{type: mongoose.Schema.Types.ObjectId, ref: 'Literature'}],
    graphics: [{type: mongoose.Schema.Types.ObjectId, ref: 'Graphic'}],
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    salt: String,
    hashedPass: String,
    roles: [String]
})

userSchema.method({
    authenticate: function (password) {
        let inputHashedPassword = encryption.generateHashedPassword(this.salt, password)
        if (inputHashedPassword === this.hashedPass) {
            return true
        } else {
            return false
        }
    }
})

let User = mongoose.model('User', userSchema)

module.exports.seedAdminUser = () => {
    "use strict";
    User.find({}).then(users => {
        if (users.length === 0) {
            let salt = encryption.generateSalt()
            let hashedPass = encryption.generateHashedPassword(salt, 'Admin12')

            User.create({
                username: 'Admin',
                firstName: 'Admin',
                lastName: 'Admin',
                email: 'Admin@abv.bg',
                salt: salt,
                hashedPass: hashedPass,
                roles: ['Admin']
            })
        }
    })
}