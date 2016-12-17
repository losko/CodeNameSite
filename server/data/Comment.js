const mongoose = require('mongoose')

let commentSchema = mongoose.Schema({
    target: { type: mongoose.Schema.Types.ObjectId, required: true },
    targetType: String,
    comment: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    date: { type: Date, default: Date.now() }
})

commentSchema.method({
    prepareDelete: function () {
        let User = mongoose.model('User')
        User.findById(this.author).then(user => {
            "use strict";
            if (user) {
                user.comments.remove(this.id)
                user.save()
            }
        })

        let Literature = mongoose.model('Literature')
        Literature.findById(this.target).then(literature => {
            "use strict";
            if (literature) {
                literature.comments.remove(this.id)
                literature.save()
            }
        })
        let Graphic = mongoose.model('Graphic')
        Graphic.findById(this.target).then(graphic => {
            "use strict";
            if (graphic) {
                graphic.comments.remove(this.id)
                graphic.save()
            }
        })
    }
})
const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment
