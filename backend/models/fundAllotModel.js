const db = require("../config/db");

exports.allotFund = async (userId, amount) => {
  const query = "INSERT INTO fund_allotments (user_id, amount) VALUES (?, ?)";
  const [result] = await db.query(query, [userId, amount]);
  return result;
};

exports.getFundByUser = async (userId) => {
  const query = "SELECT * FROM fund_allotments WHERE user_id = ?";
  const [result] = await db.query(query, [userId]);
  return result;
};
