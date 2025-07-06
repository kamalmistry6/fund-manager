const expenseModel = require("../models/expenseModel");

const normalizeExpensePayload = (payload) => ({
  name: payload.name || null,
  description: payload.description || null,
  amount: payload.amount || 0,
  paymentMethod: payload.payment_method || payload.paymentMethod || null,
  expenseDate: payload.expense_date || payload.expenseDate || null,
  status: payload.status || null,
  billPhoto: payload.bill_photo || null,
});
// Add Expense
exports.addExpense = async (req, res) => {
  const expense = normalizeExpensePayload(req.body);

  // ✅ Fixed: checking 'name' instead of 'category'
  if (!expense.name || !expense.amount) {
    return res.status(400).json({ message: "Name and Amount are required" });
  }

  const billPhotoPath = req.file ? req.file.filename : null;

  expense.billPhoto = billPhotoPath;

  try {
    await expenseModel.addExpense(expense);
    res.status(201).json({ message: "Expense added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding expense", error });
  }
};
// Get All Expenses
exports.getExpenses = async (req, res) => {
  try {
    const filters = {
      name: req.query.name || null,
      expense_date: req.query.expense_date || null,
      payment_method: req.query.payment_method || null,
      status: req.query.status || null,
    };

    const expenses = await expenseModel.getExpenses(filters);
    res.json(expenses);
  } catch (err) {
    console.error("Error fetching expenses:", err);
    res.status(500).json({ message: err.message });
  }
};


// Delete Expense
exports.deleteExpense = async (req, res) => {
  const { id } = req.params;

  try {
    await expenseModel.deleteExpense(id);
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting expense" });
  }
};
