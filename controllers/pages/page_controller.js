const controller = {

    showHome: (req, res) => {
        res.render('pages/login')
    },

    showContact: (req, res) => {
        res.render('pages/contact')
    }

}

module.exports = controller