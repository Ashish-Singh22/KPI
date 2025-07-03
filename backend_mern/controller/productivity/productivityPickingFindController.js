const productivityPickingModel = require('../../models/productivityWorkerModel'); // adjust path if needed

const productivityPickingFindController = async (req, res) => {
  try {
    const {
      dates,
      shifts,

    } = req.body;

    if (!Array.isArray(dates) || !Array.isArray(shifts) ) {
      return res.status(400).json({ message: "Missing or invalid filter fields" });
    }


    // Query for matching records
    const results = await productivityPickingModel.find({
      date: { $in: dates },
      shift: { $in: shifts },
    });

    return res.status(200).json({
      message: "Filtered productivity picker data fetched successfully",
      success: true,
      error: false,
      data: results,
    });
  } catch (error) {
    console.error("Error fetching productivity picker records:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: true,
    });
  }
};

module.exports = productivityPickingFindController;
