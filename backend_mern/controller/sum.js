const sumModel = require('../models/sumModel');

async function SumController(req, res) {
    try {
        console.log("Received:", req.body);

        const x = Number(req.body.x);
        const y = Number(req.body.y);
        const z = x + y;

        const uploadProduct = new sumModel({ x, y, z });
        const saveProduct = await uploadProduct.save();

        res.status(201).json({
            message: "Sum uploaded successfully",
            error: false,
            success: true,
            data: saveProduct
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = SumController;
