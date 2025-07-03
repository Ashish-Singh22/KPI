const mongoose = require('mongoose')


const LoadDataSchema = new mongoose.Schema({}, { strict: false }); // Accepts dynamic DataFrame structure


const packerSchema = mongoose.Schema({
   "date": { type: String, required: true },
   "shift": { type: Number, required: true },
   "count_basis": { type: String },
   "time": { type: String },
   "load_data": [LoadDataSchema]  // Each row of the DataFrame as an object

},{
    timestamps : true
})

const packerModel = mongoose.model("packer",packerSchema)

module.exports = packerModel