const mongoose = require('mongoose');

const dpmoSchema = new mongoose.Schema({
  duration: {
    type: String,
    required: true,
  },
  claim_resp: {
    type: String,
    required: true,
  },
  claim_data: {
    type: mongoose.Schema.Types.Mixed, // Allows arbitrary nested object
    required: true,
  },
  t_claim: {
    type: Number,
    required: true,
  },
  t_quantity: {
    type: Number,
    required: true,
  },
  t_claim_value: {
    type: Number,
    required: true,
  },
  claim_status: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const dpmoModel = mongoose.model('dpmo', dpmoSchema);
module.exports = dpmoModel;
