const { boolean } = require('joi')
const mongoose = require('mongoose')

const rfidSchema = new mongoose.Schema({
    rfid: {
        type: String,
        required: true,
    },
    inUsed: {
        type: Boolean,
        default: false,
    }

})

const rfid = mongoose.model('rfid', rfidSchema)

module.exports = rfid
