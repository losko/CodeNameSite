const mongoose = require('mongoose')
const fs = require('fs')
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
    },
    prepareDelete: function () {
        let Comment = mongoose.model('Comment')
        for (let comment of this.comments) {
            Comment.findById(comment).then(comment => {
                comment.prepareDelete()
                comment.remove()
            })
        }

        let Literature = mongoose.model('Literature')
        for (let literature of this.literature) {
            Literature.findById(literature).then(literature => {
                "use strict";
                literature.prepareDelete()
                literature.remove()
            })
        }

        let Graphic = mongoose.model('Graphic')
        for (let graphic of this.graphics) {
            Graphic.findById(graphic).then(graphic => {
                "use strict";
                let lifePath = 'public'+graphic.image+'.png'
                fs.unlinkSync(lifePath)
                graphic.prepareDelete()
                graphic.remove()
            })
        }
    }
})

userSchema.set('versionKey', false);

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