const userModel = require("../../models/users/users");
const userValidators = require("../validators/users");
const rfidModel = require("../../models/rfid/rfid");
const counterModel = require("../../models/counters");
const ImageKit = require("imagekit");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const vCardsJS = require('vcards-js');

const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

console.log(imageKit);

const controller = {
  showInternalProfile: async (req, res) => {
    let userId = res.locals.userAuth
    // get user data from db using session user
    const profile = await userModel.findById(userId);
    const counterProfile = await counterModel.findOne({ rfid: profile.rfid });
    const newProfile = JSON.parse(JSON.stringify(profile));
    newProfile.countView = counterProfile.date.length
    res.json(newProfile);
  },
  showEditInternalProfile: async (req, res) => {
    let userId = res.locals.userAuth
    const profile = await userModel.findById(userId);
    res.json(profile);
  },
  editInternalProfile: async (req, res) => {
    let userId = res.locals.userAuth
    console.log('1st',req.body)
    // validations here ...
    
    delete req.body["_id"]
    delete req.body["rfid"]
    delete req.body["email"]
    delete req.body["hash"]
    delete req.body["__v"]
    delete req.body["links"]
    delete req.body["countView"]
    const validationResults = userValidators.updateValidator.validate(req.body);
    console.log('2nd',validationResults)
    
    if (validationResults.error) {
      return res.status(404).json({error: "failed"})
    }
    const validatedResults = validationResults.value;
    
    
    console.log('Results', validationResults.value)
    const updateDocument = await userModel.findOneAndUpdate({ _id: userId }, validatedResults, { new: true });
    return res.status(200).json("successful")
  },
  
  showExternalProfile: async (req, res) => {
    const userRfid = req.params.rfid;
    const profile = await userModel.findOne({ rfid: userRfid });
    if (!profile) {
      res.send("profile not found");
      return;
    }
    const countProfileCurrent = await counterModel.findOne({ rfid: userRfid });
    console.log(countProfileCurrent);
    const newDate = new Date();
    countProfileCurrent.date.push(newDate);
    const countProfileUpdate = await counterModel.findOneAndUpdate({ rfid: userRfid }, countProfileCurrent, { new: true });
    res.render("profile/externalprofile", { profile });
  },
  deleteInternalProfile: async (req, res) => {
    let userId = res.locals.userAuth
    console.log("delete", userId);
    user = await userModel.findOne({ _id: userId });
    console.log("RFID", user.rfid);
    const deleteDocument = await userModel.findByIdAndRemove({ _id: userId });
    const rfidDocument = await rfidModel.findOneAndUpdate({ rfid: user.rfid, inUsed: true }, { inUsed: false }, { new: true });
    return res.status(200).json("successful")
  },
  uploadPhoto: async (req, res) => {
    let userId = res.locals.userAuth
    // const profile = await userModel.findOne({ _id: userId });
    // res.send("succesful")
    // console.log("")
    // console.log("")
    // console.log("------------- profile -------------")
    // console.log(profile)
    // console.log("")
    if (req.file) {
      imageKit.upload(
        {
          file: req.file.buffer,
          fileName: req.file.originalname,
          folder: "user_avatars",
        },
        async function (err, response) {
          if (err) {
            return res.status(500).json({
              status: "failed",
              message: "An error occured during file upload. Please try again.",
            });
          } else {
            console.log(response.thumbnailUrl)
            // profile["url"] = response.thumbnailUrl;
            // console.log("")
            // console.log("")
            // console.log("------------- profile -------------")
            // console.log(profile)
            // console.log("")
            // console.log("profile", profile);
            // const updateDocument = await userModel.findOneAndUpdate({_id: userId}, {profile}, {new: true})
            const updateDocument = await userModel.findOneAndUpdate({_id: userId}, {url: response.thumbnailUrl}, {new: true})
            console.log("")
            console.log("")
            console.log("------------- updateDocument -------------")
            console.log(updateDocument)
            console.log("")
            // console.log('check',updateDocument)
            if (updateDocument) {
              return res.status(200).json("successful")
            } 
              
          }
        },

      );
    }
  },
  generateVCF: async (req, res)=> {
    let userId = res.locals.userAuth
    const profile = await userModel.findOne({ _id: userId });
    // console.log(profile)
    console.log(profile.name)
    console.log(profile.contact)
    const vCard = vCardsJS()
    vCard.firstName = profile.name
    vCard.cellPhone = profile.contact
    console.log(vCard)
    const cardName = profile.name & ".vcf"
    res.set('Content-Type', `text/vcard; name=${cardName}`);
    res.set('Content-Disposition', `inline; filename=${cardName}`);
    return res.status(200).json(vCard.getFormattedString())
    //simliarhttps://codesandbox.io/s/s2gyj?file=/index.js https://www.npmjs.com/package/vcards-js
  }
};

module.exports = controller;
