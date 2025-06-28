export interface ExpensesDashboardStats {
  paymentModeStats?: PaymentModeStats;
  statusStats?: StatusStats;
  amountStats?: AmountStats;
  totalExpenses?: number;
  totalReceipt?: number;
}

export interface PaymentModeStats {
  total: number;
  online: string;
  cash: string;
  cheque: string;
}

export interface StatusStats {
  paid: string;
  pending: string;
}

export interface AmountStats {
  totalAmount: string;
  onlineAmount: string;
  cashAmount: string;
  chequeAmount: string;
}
