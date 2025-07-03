const productivityModel = require('../../models/productivityModel'); // Adjust path if needed

const findProductivityController = async (req, res) => {
  try {
    const {
      dates,
      organization,
    } = req.body;

    if (!Array.isArray(dates) || !organization) {
      return res.status(400).json({ message: "Missing or invalid filter fields" });
    }


    // Query for matching records
    const results = await productivityModel.find({
      date: { $in: dates },
      organization: organization,
    });

    return res.status(200).json({
      message: "Filtered productivity data fetched successfully",
      success: true,
      error: false,
      data: results,
    });
  } catch (error) {
    console.error("Error fetching productivity records:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: true,
    });
  }
};

module.exports = findProductivityController;