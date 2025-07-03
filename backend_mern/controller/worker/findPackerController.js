const packerModel = require('../../models/packerModel'); // Adjust path if needed

const findPackerController = async (req, res) => {
  try {
    const {
      dates,
      shifts,
      countBasis,
      timeBasis,
    } = req.body;
    console.log(req.body)
    
    if (!Array.isArray(dates) || !Array.isArray(shifts) || !countBasis || !timeBasis) {
      return res.status(400).json({ message: "Missing or invalid filter fields" });
    }


    // Query for matching records
    const results = await packerModel.find({
      date: { $in: dates },
      shift: { $in: shifts },
      count_basis: countBasis,
      time: timeBasis,
    });
    console.log(results)

    return res.status(200).json({
      message: "Filtered packer data fetched successfully",
      success: true,
      error: false,
      data: results,
    });
  } catch (error) {
    console.error("Error fetching packer records:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: true,
    });
  }
};

module.exports = findPackerController;