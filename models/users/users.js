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
        type: Number,
        required: true
    },
    telegram: {
        type: String,
    },
    instagram: {
        type: String,
    },
    whatsapp: {
        type: String,
    },
    github: {
        type: String,
    },
    url: {
        type: String,
    },
    links: [
        {
            id: mongoose.Types.ObjectId,
            title: String,
            url: String
        }
    ]

})

const User = mongoose.model('User', userSchema)

module.exports = User
