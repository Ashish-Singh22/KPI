const pickerModel = require('../../models/pickerModel'); // Adjust path if needed

const findPickerController = async (req, res) => {
  try {
    const {
      dates,
      shifts,
      countBasis,
      timeBasis,
    } = req.body;

    if (!Array.isArray(dates) || !Array.isArray(shifts) || !countBasis || !timeBasis) {
      return res.status(400).json({ message: "Missing or invalid filter fields" });
    }


    // Query for matching records
    const results = await pickerModel.find({
      date: { $in: dates },
      shift: { $in: shifts },
      count_basis: countBasis,
      time: timeBasis,
    });

    return res.status(200).json({
      message: "Filtered picker data fetched successfully",
      success: true,
      error: false,
      data: results,
    });
  } catch (error) {
    console.error("Error fetching picker records:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: true,
    });
  }
};

module.exports = findPickerController;