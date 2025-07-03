const productivityModel = require('../../models/productivityModel'); // adjust path if needed

const uploadProductivityController = async (req, res) => {
  try {
    const data = req.body;

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ message: "No records provided in 'data'" });
    }

    // Insert each record as a separate document
    const insertedRecords = await productivityModel.insertMany(data);

    res.status(200).json({
      message: "productivity records uploaded successfully",
      success: true,
      error: false,
      insertedCount: insertedRecords.length
    });
  } catch (error) {
    console.error("Error uploading productivity records:", error);
    res.status(500).json({ message: "Internal server error" || error.message ,
     success: true,
     error: false,
    });
  }
};

module.exports = uploadProductivityController;