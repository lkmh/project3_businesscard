const userModel = require('../../models/users/users')
const userValidators = require('../validators/users')
const rfidModel = require('../../models/rfid/rfid')
const counterModel = require('../../models/counters')
const ImageKit = require("imagekit")

const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
})

console.log(imageKit)

const controller = {
    showInternalProfile: async (req, res) => {
        const userId = req.session.userId
        // get user data from db using session user
        console.log(userId)
        // const profile = await userModel.find({email: req.params.email})
        const profile = await userModel.findById(userId)
        console.log(profile)
        const counterProfile = await counterModel.findOne({rfid: profile.rfid})
        console.log('count',counterProfile.date)
        profile.count = counterProfile.date.length

        res.render('profile/profile', {profile})
    },
    showEditInternalProfile: async (req, res) => {
        const userId = req.session.userId
        // get user data from db using session user
    
        // const profile = await userModel.find({email: req.params.email})
        const profile = await userModel.findById(userId)

        res.render('profile/editprofile', {profile})
    },
    editInternalProfile: async (req,res) => {
        const userId = req.session.userId
        const validationResults = userValidators.updateValidator.validate(req.body)
        if (validationResults.error) {
            console.log('validation error')
            res.render('pages/error_update')
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
        const countProfileCurrent = await counterModel.findOne({rfid: userRfid})
        console.log(countProfileCurrent)
        const newDate = new Date()
        countProfileCurrent.date.push(newDate)
        const countProfileUpdate = await counterModel.findOneAndUpdate({rfid:userRfid}, countProfileCurrent, {new: true})
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
    showUploadPhoto: (req,res) => {
        const userId = req.session.userId
        
        res.render('profile/uploadphoto')
    },
    uploadPhoto: async (req,res) => {
      const userId = req.session.userId
      const profile = await userModel.findOne({_id: userId})
        // res.send("succesful")
        if (req.file) {
            imageKit.upload({
              file: req.file.buffer,
              fileName: req.file.originalname,
              folder: 'user_avatars'
            }, function(err, response) {
              if(err) {
                return res.status(500).json({
                  status: "failed",
                  message: "An error occured during file upload. Please try again."
                })
              
            } else {
              console.log("pass")
              const { url } = response
              profile['url'] = response.thumbnailUrl
              console.log('profile',profile)
              res.render('profile/editprofile', {profile})
              // const updateDocument = userModel.findOneAndUpdate({_id: userId}, {instagram:'test'}, {new: true})
            
              // res.send("Successfully uploaded files" );
              }
            })
          }
    }
}

module.exports = controller