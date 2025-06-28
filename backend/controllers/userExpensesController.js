const fundAllotModel = require("../models/fundAllotModel");
const userExpensesModel = require("../models/userExpensesModel");

exports.addUserExpense = async (req, res) => {
  try {
    const { userId, amount, title } = req.body;

    if (!userId || !amount || !title) {
      return res
        .status(400)
        .json({ error: "userId, amount, and title are required" });
    }

    // Fetch user funds
    const funds = await fundAllotModel.getFundByUser(userId);
    if (!funds.length) {
      return res.status(404).json({ error: "Fund not found for user" });
    }

    // Total fund allotted to the user
    const totalFund = funds.reduce(
      (sum, fund) => sum + parseFloat(fund.amount),
      0
    );

    // Fetch total expenses made by user
    const result = await userExpensesModel.getTotalExpensesByUser(userId);
    const totalExpenses = result[0].totalExpenses || 0;

    const remaining = totalFund - totalExpenses;

    if (amount > remaining) {
      return res.status(400).json({ error: "Insufficient fund balance" });
    }

    // Add new expense
    await userExpensesModel.addUserExpense(userId, title, amount);

    res.status(201).json({ message: "Expense added successfully" });
  } catch (err) {
    console.error("Error adding user expense:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getUserExpensesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const expenses = await userExpensesModel.getUserExpensesByUser(userId);
    res.json(expenses);
  } catch (err) {
    console.error("Error fetching expenses:", err);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
};

exports.getTotalAmount = async (req, res) => {
  try {
    const { userId } = req.params;
    const expenses = await userExpensesModel.getTotalAmount(userId);
    res.json(expenses);
  } catch (err) {
    console.error("Error fetching total amount:", err);
    res.status(500).json({ error: "Failed to fetch total amount" });
  }
};
