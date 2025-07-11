const expenseModel = require("../models/expenseModel");

const normalizeExpensePayload = (payload, billPhoto = null) => ({
  name: payload.name || null,
  description: payload.description || null,
  amount: payload.amount || 0,
  paymentMethod: payload.payment_method || payload.paymentMethod || null,
  expenseDate: payload.expense_date || payload.expenseDate || null,
  status: payload.status || null,
  billPhoto: billPhoto || payload.bill_photo || null,
});

// Add Expense
exports.addExpense = async (req, res) => {
  try {
    const billPhotoPath = req.file ? req.file.filename : null;
    const expense = normalizeExpensePayload(req.body, billPhotoPath);

    if (!expense.name || !expense.amount) {
      return res.status(400).json({ message: "Name and Amount are required" });
    }

    await expenseModel.addExpense(expense);
    return res.status(201).json({ message: "Expense added successfully" });
  } catch (error) {
    console.error("Add Expense Error:", error);
    return res.status(500).json({ message: "Error adding expense" });
  }
};

// Get All Expenses
exports.getExpenses = async (req, res) => {
  try {
    const filters = {
      name: req.query.name || null,
      expenseDate: req.query.expense_date || null,
      paymentMethod: req.query.payment_method || null,
      status: req.query.status || null,
    };

    const expenses = await expenseModel.getExpenses(filters);
    return res.status(200).json(expenses);
  } catch (error) {
    console.error("Get Expenses Error:", error);
    return res.status(500).json({ message: "Error fetching expenses" });
  }
};

// Delete Expense
exports.deleteExpense = async (req, res) => {
  try {
    await expenseModel.deleteExpense(req.params.id);
    return res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Delete Expense Error:", error);
    return res.status(500).json({ message: "Error deleting expense" });
  }
};
