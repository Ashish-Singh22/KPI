const inventoryModel = require('../../models/inventoryModel'); // Adjust path as needed

const findInventoryController = async (req, res) => {
  try {
    const {
      weeks, // array of numbers
      month, // number
      organization, // string
    } = req.body;
    console.log(weeks,month,organization)
    // Validation
    if (
      !Array.isArray(weeks) || weeks.length === 0 ||
      typeof organization !== 'string' || organization.trim() === ''
    ) {
      return res.status(400).json({
        message: "Missing or invalid filter fields",
        success: false,
        error: true,
      });
    }

    // Query and sort by week in ascending order
    const results = await inventoryModel.find({
      week: { $in: weeks },
      month: month,
      organization: organization.trim(),
    }).sort({ week: 1 });

    return res.status(200).json({
      message: "Filtered inventory data fetched successfully",
      success: true,
      error: false,
      data: results,
    });
  } catch (error) {
    console.error("Error fetching inventory records:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: true,
    });
  }
};

module.exports = findInventoryController;
