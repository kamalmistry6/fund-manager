const db = require("../config/db");

exports.getExpenses = async (filters) => {
  let query = `SELECT * FROM expense WHERE 1=1`;
  const params = [];

  if (filters.name) {
    query += ` AND name LIKE ?`;
    params.push(`%${filters.name}%`);
  }

  if (filters.expense_date) {
    query += ` AND DATE(expense_date) = ?`;
    params.push(filters.expense_date);
  }

  if (filters.payment_method) {
    query += ` AND payment_method = ?`;
    params.push(filters.payment_method);
  }

  if (filters.status) {
    query += ` AND status = ?`;
    params.push(filters.status);
  }

  query += ` ORDER BY expense_date DESC`;

  const [rows] = await db.execute(query, params);
  return rows;
};

// Add Expense
exports.addExpense = async (expense) => {
  const sql = `
    INSERT INTO expense (name, description, expense_date, payment_method, status, amount, bill_photo)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    expense.name,
    expense.description,
    expense.expenseDate || expense.expense_date,
    expense.paymentMethod || expense.payment_method,
    expense.status,
    expense.amount,
    expense.billPhoto || expense.bill_photo,
  ];

  return db.execute(sql, values);
};

// Delete Expense
exports.deleteExpense = async (id) => {
  const sql = `DELETE FROM expense WHERE id = ?`;
  return db.execute(sql, [id]);
};
