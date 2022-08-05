const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    rfid: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    hash: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    telegramId: {
        type: String,
    },
    IGId: {
        type: String,
    },
    whatapp: {
        type: String,
    },


})

const User = mongoose.model('User', userSchema)

module.exports = User
