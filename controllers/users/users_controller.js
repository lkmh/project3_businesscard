const bcrypt = require('bcrypt')
const userModel = require('../../models/users/users')
const userValidators = require('../validators/users')
const rfidModel = require('../../models/rfid/rfid')
// const userValidators = require('../validators/users')


const controller = {

    showRegistrationForm: (req, res) => {
        res.render('pages/register')
    },

    register: async (req, res) => {
        console.log("register")
        // validations
        const validationResults = userValidators.registerValidator.validate(req.body)

        if (validationResults.error) {
            console.log('validation error')
            res.send(validationResults.error)
            return
        }

        const validatedResults = validationResults.value

        // ensure that password and confirm_password matches
        if (validatedResults.password !== validatedResults.confirm_password) {
            res.send('passwords do not match')
            return
        }
        isEmailUsed = await userModel.findOne({email: validatedResults.email})

        if (isEmailUsed) {
            res.send('Email is in use')
            return
        }

        // ensure that serial number is in the database (to do2. ) amend this 
        
        const rfidDocument = await rfidModel.findOneAndUpdate({rfid: validatedResults.rfid, inUsed: false }, {inUsed: true}, {new: true})
        
        if (!rfidDocument) {
            console.log(rfidDocument)
            res.send('RFID not Valid, please purchase one from the store')
            return
        }

        // hash the password
        const hash = await bcrypt.hash(validatedResults.password, 10)

        // create the user and store in db => not storing 
        try {
            await userModel.create({
                rfid: validatedResults.rfid,
                email: validatedResults.email,
                hash: hash,
                name: validatedResults.name,
                contact: validatedResults.contact,
            })
        } catch(err) {
            console.log(err)
            res.send('failed to create user')
            return
        }

        res.redirect('/users/login')
    },

    showLoginForm: (req, res) => {
        res.render('pages/login')
    },

    login: async (req, res) => {
        // validations here ...
        const validationResults = userValidators.loginValidator.validate(req.body)

        if (validationResults.error) {
            console.log('validation error')
            res.send(validationResults.error)
            return
        }

        const validatedResults = validationResults.value

        let user = null

        // get user with email from DB 
        
        user = await userModel.findOne({email: validatedResults.email})
        console.log('isthere data',user)
        if (!user) {
            res.send('failed to get user')
            return
        }

        // use bcrypt to compare the given password with the one store as has in DB
        const pwMatches = await bcrypt.compare(validatedResults.password, user.hash)

        if (!pwMatches) {
            res.send('incorrect password')
            return
        }
        console.log("login successful")
        // log the user in by creating a session
        req.session.regenerate(function (err) {
            if (err) {
                res.send('unable to regenerate session')
                return
            }
        
            // store user information in session, typically a user id
            console.log(user._id)
            req.session.userId = user._id
        
            // save the session before redirection to ensure page
            // load does not happen before session is saved
            req.session.save(function (err) {
                if (err) {
                    res.send('unable to save session')
                    return
                }

                res.redirect('/profile')
            })
          })
    },

    logout: async (req, res) => {
        req.session.user = null

        req.session.save(function (err) {
            if (err) {
                res.redirect('/users/login')
                return
            }

            // regenerate the session, which is good practice to help
            // guard against forms of session fixation
            req.session.regenerate(function (err) {
                if (err) {
                    res.redirect('/users/login')
                    return
                }
                
                res.redirect('/')
            })
        })
    }

}

module.exports = controller