const db = require("../config/db");

exports.getDashboardStats = async (req, res) => {
  try {
    const [expensesStatsRows] = await db.execute(`
      SELECT
        COUNT(*) as totalExpenses,
        SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as totalExpensesAmount
      FROM expense
    `);

    // Amount Stats + Total Receipts
    const [fundStatsRows] = await db.execute(`
      SELECT 
        SUM(CASE WHEN marked_as_pay_later = 'paid' THEN amount ELSE 0 END) as totalAmount,
        SUM(CASE WHEN mode_of_payment = 'cash' THEN amount ELSE 0 END) as openingCash,
        SUM(CASE WHEN mode_of_payment IN ('online', 'cheque') THEN amount ELSE 0 END) as openingBank
      FROM fund_records
    `);
    const [allotStatsRows] = await db.execute(`
      SELECT 
        (SELECT SUM(amount) FROM fund_allotments) AS totalAllottedAmount,
        (SELECT SUM(amount) FROM user_expenses) AS totalExpenseAmount
    `);

    // Final Structured Response
    const stats = {
      expensesStats: {
        totalExpenses: expensesStatsRows[0].totalExpenses,
        totalExpensesAmount: expensesStatsRows[0].totalExpensesAmount,
      },

      allotStats: {
        totalAllotAmount: allotStatsRows[0].totalAllottedAmount,
        totalExpenseAmount: allotStatsRows[0].totalExpenseAmount,
      },

      amountStats: {
        totalAmount: fundStatsRows[0].totalAmount,
        openingCash: fundStatsRows[0].openingCash,
        openingBank: fundStatsRows[0].openingBank,
      },
    };

    res.json(stats);
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ message: "Error fetching dashboard stats" });
  }
};
