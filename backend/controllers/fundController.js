const fundModel = require("../models/fundModel");
const ExcelJS = require("exceljs");

const PLACE = "Palghar";
const YEAR = "22";

// GET: Funds with filters
exports.getFunds = async (req, res) => {
  try {
    const filters = {
      receipt_no: req.query.receipt_no || null,
      name: req.query.name || null,
      date: req.query.date || null,
      mode_of_payment: req.query.mode_of_payment || null,
      marked_as_pay_later: req.query.marked_as_pay_later || null,
      building: req.query.building || null,
    };

    const funds = await fundModel.getFunds(filters);
    return res.status(200).json(funds);
  } catch (err) {
    console.error("Error fetching funds:", err);
    return res.status(500).json({ message: "Failed to fetch fund records" });
  }
};

// POST: Add new fund
exports.addFund = async (req, res) => {
  try {
    const {
      receipt_no,
      name,
      mode_of_payment,
      amount,
      building,
      marked_as_pay_later = "paid", // default to 'paid'
    } = req.body;

    if (!name || !building) {
      return res
        .status(400)
        .json({ message: "Name and Building are required" });
    }

    const isPaid = marked_as_pay_later === "paid";

    if (isPaid && (!receipt_no || !mode_of_payment || !amount)) {
      return res.status(400).json({
        message:
          "Receipt No, Mode of Payment, and Amount are required when marked as paid",
      });
    }

    if (isPaid) {
      const receiptExists = await fundModel.checkReceiptExists(receipt_no);
      if (receiptExists) {
        return res
          .status(409)
          .json({ message: "Receipt number already exists" });
      }
    }

    const fundData = {
      receipt_no: isPaid ? receipt_no : null,
      name,
      mode_of_payment: isPaid ? mode_of_payment : null,
      date: new Date(),
      place: PLACE,
      amount: isPaid ? amount : null,
      year: YEAR,
      building,
      marked_as_pay_later,
    };

    const result = await fundModel.addFund(fundData);
    return res
      .status(201)
      .json({ message: "Fund record added successfully", id: result.insertId });
  } catch (err) {
    console.error("Error adding fund:", err);
    return res.status(500).json({ message: "Failed to add fund record" });
  }
};

// DELETE: Fund
exports.deleteFund = async (req, res) => {
  try {
    const result = await fundModel.deleteFund(req.params.id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    return res.status(200).json({ message: "Record deleted successfully" });
  } catch (err) {
    console.error("Error deleting fund:", err);
    return res.status(500).json({ message: "Failed to delete fund record" });
  }
};

// GET: Download Excel
exports.downloadFundsExcel = async (req, res) => {
  try {
    const funds = await fundModel.getAllFunds();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Fund Records");

    worksheet.columns = [
      { header: "Receipt No", key: "receipt_no", width: 15 },
      { header: "Name", key: "name", width: 20 },
      { header: "Building", key: "building", width: 20 },
      { header: "Mode of Payment", key: "mode_of_payment", width: 15 },
      { header: "Place", key: "place", width: 15 },
      { header: "Year", key: "year", width: 8 },
      { header: "Date", key: "date", width: 15 },
      { header: "Amount", key: "amount", width: 10 },
    ];

    funds.forEach((fund) => {
      worksheet.addRow(fund);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=fund-records-${Date.now()}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Error generating Excel:", err);
    res.status(500).json({ message: "Failed to generate Excel file" });
  }
};
