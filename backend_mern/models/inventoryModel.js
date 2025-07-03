const mongoose = require('mongoose')

const inventorySchema = mongoose.Schema({
   "organization" : {type:String,required:true},
   "week": { type: String, required: true },
   "month": { type: String, required: true },
   "Locator Accuracy": {type: Number, required: true},
   "Piece Accuracy":{type: Number, required: true},
   "Net Accuracy":{type: Number, required: true},
   "Gross Accuracy":{type: Number, required: true},
   "Inventory discrepancy-Net":{type: Number, required: true},
   "Inventory discrepancy-Gross":{type: Number, required: true},
   "Total Amount Counted in Cr":{type: Number, required: true},
   "Shelf Space Vacancies (% of Empty Locations)":{type: Number, required: true},
   "Total Number of Tasks generated":{type: Number, required: true},
   "Tasks Completion Within 48Hrs":{type: Number, required: true},
   "Tasks Pending beyond 48 Hrs":{type: Number, required: true},
   "Total Number of Tasks Accepted with 0 Variance":{type: Number, required: true},
   "Total Number of Tasks Rejected with Variance":{type: Number, required: true},

},{
    timestamps : true
})

const inventoryModel = mongoose.model("inventory",inventorySchema)

module.exports = inventoryModel