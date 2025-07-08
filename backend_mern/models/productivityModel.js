const mongoose = require('mongoose')

const productivitySchema = mongoose.Schema({
date: {
    type: String,
    required: true,
  },
  dn_count: {
    type: Number,
    required: true,
  },
  ship_priority: {
    type: Map,
    of: [Number], // Each key maps to an array of numbers
    required: true,
  },
  organization: {
    type: String,
    required: true,
  },
  total_through_put_to_pic_hour: {
    type: Number,
    required: true,
  },
  total_pic_to_pac_hour: {
    type: Number,
    required: true,
  },
  total_pac_to_inv_hour: {
    type: Number,
    required: true,
  },
  total_quantity: {
    type: Number,
    required: true,
  },
  total_lines: {
    type: Number,
    required: true,
  },
  total_dn_value: {
    type: Number,
    required: true,
  },
},{
    timestamps : true
})

const productivityModel = mongoose.model("productivity",productivitySchema)

module.exports = productivityModel