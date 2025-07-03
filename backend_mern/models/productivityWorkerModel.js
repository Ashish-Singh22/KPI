const mongoose = require("mongoose");
const { Schema } = mongoose;

const productivityPickingSchema = new Schema({
  date: {
    type: String,
    required: true
  },
  shift: {
    type: Number,
    required: true
  },
  data: {
    type: Schema.Types.Mixed,  // Accepts any object structure
    required: true
  }
});

const productivityPickingModel = mongoose.model("productivity-picking", productivityPickingSchema)

module.exports = productivityPickingModel;
