const shipmentModel = require('../../models/shipmentModel'); // Adjust path if needed

const findShipmentController = async (req, res) => {
  try {
    const {
      dates,
      organization,
    } = req.body;

    if (!Array.isArray(dates) || !organization) {
      return res.status(400).json({ message: "Missing or invalid filter fields" });
    }
    // Query for matching records
    const results = await shipmentModel.find({
      date: { $in: dates },
      organization: organization,
    });

    return res.status(200).json({
      message: "Filtered shipment data fetched successfully",
      success: true,
      error: false,
      data: results,
    });
  } catch (error) {
    console.error("Error fetching shipment records:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: true,
    });
  }
};

module.exports = findShipmentController;