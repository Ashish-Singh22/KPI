const inventoryModel = require('../../models/inventoryModel'); // adjust path if needed

const uploadInventoryController = async (req, res) => {
  try {
    const data = req.body;

    // Destructure required fields for uniqueness check
    const { organization, week, month } = data;

    if (!organization || !week || !month) {
      return res.status(400).json({
        message: "Missing required fields: organization, week, or month",
        success: false,
        error: true,
      });
    }

    // Check for existing record
    const existingRecord = await inventoryModel.findOne({ organization, week, month });

    if (existingRecord) {
      return res.status(409).json({
        message: "Inventory record for this organization, week, and month already exists",
        success: false,
        error: true,
        data: existingRecord,
      });
    }

    // Save new record
    const newInventory = new inventoryModel(data);
    const savedInventory = await newInventory.save();

    return res.status(200).json({
      message: "Inventory record uploaded successfully",
      success: true,
      error: false,
      data: savedInventory,
    });

  } catch (error) {
    console.error("Error uploading inventory records:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error: true,
    });
  }
};

module.exports = uploadInventoryController;
