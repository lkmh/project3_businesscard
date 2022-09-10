const bcrypt = require("bcrypt");
const userModel = require("../../models/users/users");
const userValidators = require("../validators/users");
const rfidModel = require("../../models/rfid/rfid");
const counterModel = require("../../models/counters");
const jwt = require('jsonwebtoken')

const controller = {

  register: async (req, res) => {
    console.log("register");
    // validations
    const validationResults = userValidators.registerValidator.validate(req.body);
    if (validationResults.error) {
      // res.send(validationResults.error)
      return res.status(400).json({error: "bad input"})
    }

    const validatedResults = validationResults.value;
    validatedResults["url"] =
      "https://images.generated.photos/aNWVduQrveJoCSYCMqZab1M6yGaAOayiL1IRY5b6jQQ/rs:fit:512:512/wm:0.95:sowe:18:18:0.33/czM6Ly9pY29uczgu/Z3Bob3Rvcy1wcm9k/LnBob3Rvcy92M18w/ODAzNDU1LmpwZw.jpg";

    // ensure that password and confirm_password matches
    if (validatedResults.password !== validatedResults.confirm_password) {
      // res.send('passwords do not match')
      return res.status(400).json({error: "bad input"})
    }
    isEmailUsed = await userModel.findOne({ email: validatedResults.email });

    if (isEmailUsed) {
      // res.send('Email is in use')
      return res.status(409).json({error: "Email in-use"})
    }

    const rfidDocument = await rfidModel.findOneAndUpdate({ rfid: validatedResults.rfid, inUsed: false }, { inUsed: true }, { new: true });

    if (!rfidDocument) {
      return res.status(500).json({error: "RFID not Valid, please purchase one from the store"})
    }
    // hash the password
    const hash = await bcrypt.hash(validatedResults.password, 10);

    // create the user and store in db => not storing
    try {
      await userModel.create({
        rfid: validatedResults.rfid,
        email: validatedResults.email,
        hash: hash,
        name: validatedResults.name,
        contact: validatedResults.contact,
        url: validatedResults.url,
      });
      await counterModel.create({
        rfid: validatedResults.rfid,
      });
    } catch (err) {
      console.log(err);
      // res.send('failed to create user')
      return res.status(500).json({error: "Failed to create animal"})
    }

    return res.status(201).json()
  },

  login: async (req, res) => {
    console.log(req.body)
    // validations here ...
    const validationResults = userValidators.loginValidator.validate(req.body);
    console.log(validationResults)
    if (validationResults.error) {
      // res.send(validationResults.error)
      return res.status(400).json({error: "bad inputa"})
    }

    const validatedResults = validationResults.value;

    let user = null;

    // get user with email from DB

    user = await userModel.findOne({ email: validatedResults.email });
    if (!user) {
      // res.send('failed to get user')
      return res.status(500).json({error: "failed to get user"})
    }
    console.log('userid',user._id)

    // use bcrypt to compare the given password with the one store as has in DB
    const pwMatches = await bcrypt.compare(validatedResults.password, user.hash);

    if (!pwMatches) {
      // res.send('incorrect password')
      return res.status(401).json({error: "user email or password is incorrect"})
    }
    const token = jwt.sign({
          exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
          data: user._id, //user.local.auth
          }, process.env.JWT_SECRET)
      return res.json({token})
  },
};

module.exports = controller;
