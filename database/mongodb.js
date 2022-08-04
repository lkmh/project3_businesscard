const mongoose = require('mongoose')

const connStr = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@ga.dijs6uo.mongodb.net/?retryWrites=true&w=majority`
const DB = mongoose.connect(connStr, { dbName: 'tapcard'})

module.exports = DB
