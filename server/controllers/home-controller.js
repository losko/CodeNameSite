module.exports = {
    index: (req, res) => {
        "use strict";
        res.render('home/index')
    },
    about: (req, res) => {
        "use strict";
        res.render('home/about')
    }
}
