const mongoose = require('mongoose')

let graphicSchema = mongoose.Schema({
    category: { type: String, required: true},
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    views: {type: Number},
    date: { type: String }
})

graphicSchema.method({
    prepareDelete: function () {
        let User = mongoose.model('User')
        User.findById(this.author).then(user => {
            "use strict";
            if (user) {
                user.graphics.remove(this.id)
                user.save()
            }
        })

        let Comment = mongoose.model('Comment')
        for (let commentId of this.comments) {
            Comment.findOneAndRemove(commentId).populate('author').then(comment => {
                "use strict";
                if (comment) {
                    let author = comment.author
                    let index = author.comments.indexOf(commentId)

                    let count = 1
                    author.comments.splice(index, count);
                    author.save()
                    comment.save()
                }
            })
        }
    }
})
graphicSchema.set('versionKey', false);


const Graphic = mongoose.model('Graphic', graphicSchema)

module.exports = Graphic