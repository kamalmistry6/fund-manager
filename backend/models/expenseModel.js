const db = require("../config/db");

// Get Expenses (with filters)
exports.getExpenses = async (filters) => {
  let query = `SELECT * FROM expense WHERE 1=1`;
  const params = [];

  if (filters.name) {
    query += ` AND name LIKE ?`;
    params.push(`%${filters.name}%`);
  }

  if (filters.expenseDate) {
    query += ` AND DATE(expense_date) = ?`;
    params.push(filters.expenseDate);
  }

  if (filters.paymentMethod) {
    query += ` AND payment_method = ?`;
    params.push(filters.paymentMethod);
  }

  if (filters.status) {
    query += ` AND status = ?`;
    params.push(filters.status);
  }

  query += ` ORDER BY id DESC`;

  const [rows] = await db.execute(query, params);
  return rows;
};

// Add Expense
exports.addExpense = async (expense) => {
  const sql = `
    INSERT INTO expense (name, description, expense_date, payment_method, status, amount, bill_photo)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    expense.name,
    expense.description,
    expense.expenseDate,
    expense.paymentMethod,
    expense.status,
    expense.amount,
    expense.billPhoto,
  ];

  return db.execute(sql, values);
};

// Delete Expense
exports.deleteExpense = async (id) => {
  return db.execute(`DELETE FROM expense WHERE id = ?`, [id]);
};
