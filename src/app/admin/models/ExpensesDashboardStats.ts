export interface ExpensesDashboardStats {
  expensesStats?: ExpensesStats;
  amountStats?: AmountStats;
  allotStats?: AllotStats;
}

export interface ExpensesStats {
  totalExpenses: number;
  totalExpensesAmount: string;
}
export interface AmountStats {
  totalAmount: string;
  openingBank: string;
  openingCash: string;
}
export interface AllotStats {
  totalAllotAmount: string;
  totalExpenseAmount: string;
}
