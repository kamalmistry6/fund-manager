const fundAllotModel = require("../models/fundAllotModel");

// Allot fund to user
exports.allotFund = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || !amount) {
      return res
        .status(400)
        .json({ message: "User ID and amount are required" });
    }

    // Allot the fund
    const result = await fundAllotModel.allotFund(userId, amount);

    return res.status(201).json({
      message: "Fund allotted successfully",
      id: result.insertId,
    });
  } catch (err) {
    console.error("Error in allotFund controller:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
