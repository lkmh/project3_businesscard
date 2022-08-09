const mongoose = require('mongoose')

const counterSchema = new mongoose.Schema({
    rfid: {
        type: String,
        required: true,
    },
    date: {
        type: [Date]
    },
})

const Counter = mongoose.model('counter', counterSchema)

module.exports = Counter
