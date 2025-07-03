const mongoose = require('mongoose')

const sumSchema = mongoose.Schema({
    x: Number,
    y: Number,
    z: Number
},{
    timestamps : true
})

const sumModel = mongoose.model("sum",sumSchema)

module.exports = sumModel