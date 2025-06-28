const db = require("../config/db");

exports.addUserExpense = async (userId, title, amount) => {
  const query =
    "INSERT INTO user_expenses (user_id, title, amount) VALUES (?, ?, ?)";
  const [result] = await db.query(query, [userId, title, amount]);
  return result;
};

exports.getUserExpensesByUser = async (userId) => {
  const query = "SELECT * FROM user_expenses WHERE user_id = ?";
  const [result] = await db.query(query, [userId]);
  return result;
};

exports.getTotalExpensesByUser = async (userId) => {
  const query =
    "SELECT SUM(amount) AS totalExpenses FROM user_expenses WHERE user_id = ?";
  const [result] = await db.query(query, [userId]);
  return result;
};

exports.getTotalAmount = async (userId) => {
  const query =
    "SELECT SUM(amount) AS totalExpenses FROM fund_allotments WHERE user_id = ?";
  const [rows] = await db.query(query, [userId]);
  return { totalExpenses: parseFloat(rows[0].totalExpenses) };
};
