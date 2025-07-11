const db = require("../config/db");

exports.getDashboardStats = async (req, res) => {
  try {
    // Combined Payment Mode & Status Stats
    const [summaryStatsRows] = await db.execute(`
      SELECT 
        COUNT(*) as totalExpenses,
        SUM(payment_method = 'online') as onlinePayments,
        SUM(payment_method = 'cash') as cashPayments,
        SUM(payment_method = 'cheque') as chequePayments,
        SUM(status = 'paid') as paidExpenses,
        SUM(status = 'pending') as pendingExpenses
      FROM expense
    `);

    // Amount Stats + Total Receipts
    const [fundStatsRows] = await db.execute(`
      SELECT 
        COUNT(*) as totalReceipts,
        SUM(CASE WHEN marked_as_pay_later = 'paid' THEN amount ELSE 0 END) as totalAmount,
        SUM(CASE WHEN mode_of_payment = 'online' THEN amount ELSE 0 END) as onlineAmount,
        SUM(CASE WHEN mode_of_payment = 'cash' THEN amount ELSE 0 END) as cashAmount,
        SUM(CASE WHEN mode_of_payment = 'cheque' THEN amount ELSE 0 END) as chequeAmount
      FROM fund_records
    `);

    // Final Structured Response
    const stats = {
      totalExpenses: summaryStatsRows[0].totalExpenses,
      paymentModeStats: {
        online: summaryStatsRows[0].onlinePayments,
        cash: summaryStatsRows[0].cashPayments,
        cheque: summaryStatsRows[0].chequePayments,
      },
      statusStats: {
        paid: summaryStatsRows[0].paidExpenses,
        pending: summaryStatsRows[0].pendingExpenses,
      },
      totalReceipt: fundStatsRows[0].totalReceipts,
      amountStats: {
        totalAmount: fundStatsRows[0].totalAmount,
        onlineAmount: fundStatsRows[0].onlineAmount,
        cashAmount: fundStatsRows[0].cashAmount,
        chequeAmount: fundStatsRows[0].chequeAmount,
      },
    };

    res.json(stats);
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ message: "Error fetching dashboard stats" });
  }
};
