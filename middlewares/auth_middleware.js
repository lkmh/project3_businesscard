module.exports = {

    isAuthenticated: (req, res, next) => {
        if (!req.session.userId) {
            res.redirect('/users/login')
            return
        }
        
        next()
    },
    // template authuser -> after login get user data 
    setAuthUserVar: (req, res, next) => {
        res.locals.authUser = null
        
        if (req.session.user) {
            res.locals.authUser = req.session.user
        }

        next()
    }

}