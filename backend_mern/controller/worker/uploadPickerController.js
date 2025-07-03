const pickerModel = require('../../models/pickerModel'); // adjust path if needed

const uploadPickerController = async (req, res) => {
  try {
    // console.log(req.body)
    const data = req.body;

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ message: "No records provided in 'data'" });
    }

    // Insert each record as a separate document
    const insertedRecords = await pickerModel.insertMany(data);

    res.status(200).json({
      message: "Picker records uploaded successfully",
      success: true,
      error: false,
      insertedCount: insertedRecords.length
    });
  } catch (error) {
    console.error("Error uploading picker records:", error);
    res.status(500).json({ message: "Internal server error" || error.message ,
     success: true,
     error: false,
    });
  }
};

module.exports = uploadPickerController;