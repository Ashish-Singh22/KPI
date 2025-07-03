const dpmoModel = require('../../models/dpmoModel'); // adjust path if needed

const uploadDpmoController = async (req, res) => {
  try {
    const data = req.body;
    console.log(data)
    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ message: "No records provided in 'data'" });
    }

    // Insert each record as a separate document
    const insertedRecords = await dpmoModel.insertMany(data);

    res.status(200).json({
      message: "dpmo records uploaded successfully",
      success: true,
      error: false,
      insertedCount: insertedRecords.length
    });
  } catch (error) {
    console.error("Error uploading dpmo records:", error);
    res.status(500).json({ message: "Internal server error" || error.message ,
     success: true,
     error: false,
    });
  }
};

module.exports = uploadDpmoController;