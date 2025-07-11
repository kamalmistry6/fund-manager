const db = require("../config/db");

exports.getFunds = async (filters) => {
  let query = `SELECT * FROM fund_records WHERE 1=1`;
  const params = [];

  if (filters.receipt_no) {
    query += ` AND receipt_no = ?`;
    params.push(filters.receipt_no);
  }

  if (filters.name) {
    query += ` AND name LIKE ?`;
    params.push(`%${filters.name}%`);
  }

  if (filters.date) {
    query += ` AND DATE(date) = ?`;
    params.push(filters.date);
  }

  if (filters.mode_of_payment) {
    query += ` AND mode_of_payment = ?`;
    params.push(filters.mode_of_payment);
  }

  if (filters.marked_as_pay_later) {
    query += ` AND marked_as_pay_later = ?`;
    params.push(filters.marked_as_pay_later);
  }

  if (filters.building) {
    query += ` AND building = ?`;
    params.push(filters.building);
  }

  query += ` ORDER BY id DESC`;

  const [rows] = await db.execute(query, params);
  return rows;
};

exports.checkReceiptExists = async (receipt_no) => {
  const [rows] = await db.execute(
    `SELECT id FROM fund_records WHERE receipt_no = ? LIMIT 1`,
    [receipt_no]
  );
  return rows.length > 0;
};

exports.addFund = async (fundData) => {
  const sql = `
    INSERT INTO fund_records (
      receipt_no, name, mode_of_payment, date, place, amount, year, building, marked_as_pay_later
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    fundData.receipt_no,
    fundData.name,
    fundData.mode_of_payment,
    fundData.date,
    fundData.place,
    fundData.amount,
    fundData.year,
    fundData.building,
    fundData.marked_as_pay_later || "paid",
  ];

  const [result] = await db.execute(sql, values);
  return result;
};

exports.deleteFund = async (id) => {
  const [result] = await db.execute(`DELETE FROM fund_records WHERE id = ?`, [
    id,
  ]);
  return result;
};

exports.getAllFunds = async () => {
  const [rows] = await db.execute(
    `SELECT * FROM fund_records ORDER BY date DESC`
  );
  return rows;
};
