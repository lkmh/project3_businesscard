const controller = {

    showHome: (req, res) => {
        res.render('pages/home')
    },

    showContact: (req, res) => {
        res.render('pages/contact')
    }

}

module.exports = controller