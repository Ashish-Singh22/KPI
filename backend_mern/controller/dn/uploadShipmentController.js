const shipmentModel = require('../../models/shipmentModel'); // adjust path if needed

const uploadShipmentController = async (req, res) => {
  try {
    const data = req.body;


        const uploadShipment = new shipmentModel(req.body)
        const saveShipment = await uploadShipment.save()

    res.status(200).json({
      message: "shipment records uploaded successfully",
      success: true,
      error: false,
      data: saveShipment
    });
  } catch (error) {
    console.error("Error uploading shipment records:", error);
    res.status(500).json({ message: "Internal server error" || error.message ,
     success: true,
     error: false,
    });
  }
};

module.exports = uploadShipmentController;