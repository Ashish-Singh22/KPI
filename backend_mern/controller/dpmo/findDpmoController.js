const dpmoModel = require('../../models/dpmoModel'); // Adjust path if needed

const findDpmoController = async (req, res) => {
  try {
    // Accept 'selectedMonths' from frontend and rename to 'months' internally
    const { selectedMonths } = req.body;

    if (!Array.isArray(selectedMonths) || selectedMonths.length === 0) {
      return res.status(400).json({ message: "Missing or invalid 'selectedMonths' field" });
    }

    // Create regex conditions to match any month in 'duration'
    const regexConditions = selectedMonths.map(month => ({
      duration: { $regex: month, $options: 'i' }  // Case-insensitive matching
    }));

    // Find records where 'duration' matches any of the selected months
    const results = await dpmoModel.find({ $or: regexConditions });

    return res.status(200).json({
      message: "Filtered DPMO data fetched successfully",
      success: true,
      error: false,
      data: results,
    });
  } catch (error) {
    console.error("Error fetching DPMO records:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: true,
    });
  }
};

module.exports = findDpmoController;
