const fundModel = require("../models/fundModel");

exports.getFunds = async (req, res) => {
  try {
    const filters = {
      receipt_no: req.query.receipt_no || null,
      name: req.query.name || null,
      date: req.query.date || null,
      mode_of_payment: req.query.mode_of_payment || null,
      bulding: req.query.bulding || null,
    };

    const funds = await fundModel.getFunds(filters);
    res.json(funds);
  } catch (err) {
    console.error("Error fetching funds:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.addFund = async (req, res) => {
  try {
    const { receipt_no, name, mode_of_payment, amount, bulding } = req.body;

    if (!receipt_no || !name || !mode_of_payment || !amount || !bulding) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check for duplicate receipt no
    const receiptExists = await fundModel.checkReceiptExists(receipt_no);
    if (receiptExists) {
      return res.status(409).json({ message: "Receipt number already exists" });
    }

    const fundData = {
      receipt_no,
      name,
      mode_of_payment,
      date: new Date(),
      place: "Palghar",
      amount,
      year: "22",
      bulding,
    };

    const result = await fundModel.addFund(fundData);
    res.status(201).json({
      message: "Fund record added successfully",
      id: result.insertId,
    });
  } catch (err) {
    console.error("Error adding fund:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteFund = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await fundModel.deleteFund(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json({ message: "Record deleted successfully" });
  } catch (err) {
    console.error("Error deleting fund:", err);
    res.status(500).json({ message: err.message });
  }
};
