const userModel = require('../../models/users/users')
const userValidators = require('../validators/users')
const rfidModel = require('../../models/rfid/rfid')

const controller = {
    showInternalProfile: async (req, res) => {
        const userId = req.session.userId
        // get user data from db using session user
        console.log(userId)
        // const profile = await userModel.find({email: req.params.email})
        const profile = await userModel.findById(userId)
        console.log(profile)

        res.render('profile/profile', {profile})
    },
    showEditInternalProfile: async (req, res) => {
        const userId = req.session.userId
        // get user data from db using session user
    
        // const profile = await userModel.find({email: req.params.email})
        const profile = await userModel.findById(userId)
        console.log(profile)

        res.render('profile/editprofile', {profile})
    },
    editInternalProfile: async (req,res) => {
        const userId = req.session.userId
        const validationResults = userValidators.updateValidator.validate(req.body)
        if (validationResults.error) {
            console.log('validation error')
            res.send(validationResults.error)
            return
        }
        const validatedResults = validationResults.value
        const before_profile = await userModel.findById(userId)
        console.log('Before', before_profile)
        console.log('Data to add',validatedResults)        
        const updateDocument = await userModel.findOneAndUpdate({_id:userId}, validatedResults, {new: true})
        console.log('After',updateDocument)
        res.redirect('/profile')
    },
    showExternalProfile: async (req,res) => {
        const userRfid = req.params.rfid
        const profile = await userModel.findOne({rfid: userRfid})
        if (!profile) {
            res.send("profile not found")
            return
        }
        res.render('profile/externalprofile', {profile})
    },
    deleteInternalProfile: async (req,res) => {
        const userId = req.session.userId
        console.log("delete", userId)
        user = await userModel.findOne({_id: userId})
        console.log('RFID',user.rfid)
        const deleteDocument = await userModel.findByIdAndRemove({_id:userId})
        const rfidDocument = await rfidModel.findOneAndUpdate({rfid: user.rfid, inUsed: true }, {inUsed: false}, {new: true})
        res.redirect('/')
    },
}

module.exports = controller