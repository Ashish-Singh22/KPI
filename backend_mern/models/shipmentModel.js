const mongoose = require('mongoose')

const shipmentSchema = mongoose.Schema({
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
  t_hour: {
    type: Number,
    required: true,
  },
  t_quantity: {
    type: Number,
    required: true,
  },
  t_item: {
    type: Number,
    required: true,
  },
  t_dn_value: {
    type: Number,
    required: true,
  },
},{
    timestamps : true
})

const shipmentModel = mongoose.model("shipment",shipmentSchema)

module.exports = shipmentModel