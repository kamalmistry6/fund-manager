const db = require("../config/db");

exports.getDashboardStats = async (req, res) => {
  try {
    // Payment Mode Stats
    const [paymentModeRows] = await db.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(payment_method = 'online') as online,
        SUM(payment_method = 'cash') as cash,
        SUM(payment_method = 'cheque') as cheque
      FROM expense
    `);

    // Status Stats
    const [statusRows] = await db.execute(`
      SELECT 
        SUM(status = 'paid') as paid,
        SUM(status = 'pending') as pending
      FROM expense
    `);
    const [recepitRows] = await db.execute(`
      SELECT 
        SUM(status = 'paid') as paid,
        SUM(status = 'pending') as pending
      FROM expense
    `);

    // Amount Stats
    const [amountRows] = await db.execute(`
      SELECT 
         (SELECT SUM(amount) FROM fund_records WHERE marked_as_pay_later = 'paid') as totalAmount,
        SUM(CASE WHEN mode_of_payment = 'online' THEN amount ELSE 0 END) as onlineAmount,
        SUM(CASE WHEN mode_of_payment = 'cash' THEN amount ELSE 0 END) as cashAmount,
        SUM(CASE WHEN mode_of_payment = 'cheque' THEN amount ELSE 0 END) as chequeAmount
      FROM fund_records
    `);

    // Total Expenses Count
    const [totalExpensesRows] = await db.execute(`
      SELECT COUNT(*) as totalExpenses FROM expense
    `);

    const [receiptRows] = await db.execute(`
      SELECT COUNT(*) as totalReceipt FROM fund_records
    `);

    // Final Structured Response
    const stats = {
      paymentModeStats: paymentModeRows[0],
      statusStats: statusRows[0],
      amountStats: amountRows[0],
      totalExpenses: totalExpensesRows[0].totalExpenses,
      totalReceipt: receiptRows[0].totalReceipt,
    };

    res.json(stats);
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ message: "Error fetching dashboard stats" });
  }
};
