const fundModel = require("../models/fundModel");
const ExcelJS = require("exceljs");

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
    res.json(funds);
  } catch (err) {
    console.error("Error fetching funds:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.addFund = async (req, res) => {
  try {
    const {
      receipt_no,
      name,
      mode_of_payment,
      amount,
      building,
      marked_as_pay_later,
    } = req.body;

    if (!name || !building) {
      return res
        .status(400)
        .json({ message: "Receipt No, Name and Building are required" });
    }

    // If marked_as_pay_later is 'paid', validate receipt_no, mode_of_payment, and amount
    if (marked_as_pay_later === "paid") {
      if (!receipt_no || !mode_of_payment || !amount) {
        return res.status(400).json({
          message:
            "Receipt No, Mode of Payment, and Amount are required when marked as paid",
        });
      }

      const receiptExists = await fundModel.checkReceiptExists(receipt_no);
      if (receiptExists) {
        return res
          .status(409)
          .json({ message: "Receipt number already exists" });
      }
    }

    const fundData = {
      receipt_no: marked_as_pay_later === "paid" ? receipt_no : null,
      name,
      mode_of_payment: marked_as_pay_later === "paid" ? mode_of_payment : null,
      date: new Date(),
      place: "Palghar",
      amount: marked_as_pay_later === "paid" ? amount : null,
      year: "22",
      building,
      marked_as_pay_later,
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

exports.downloadFundsExcel = async (req, res) => {
  try {
    // ✅ Fetch all fund records (no filters)
    const funds = await fundModel.getAllFunds();

    // Create workbook & worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Fund Records");

    // Define columns
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

    // Add data rows
    funds.forEach((fund) => {
      worksheet.addRow(fund);
    });

    // Set headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=fund-records-${Date.now()}.xlsx`
    );

    // Write workbook to response stream
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Error generating Excel:", err);
    res.status(500).json({ message: "Failed to generate Excel file" });
  }
};
