export type ExpenseCategory =
  | "Dinner"
  | "Taxi"
  | "Coffee"
  | "Rent"
  | "Travel"
  | "Groceries"
  | "Utilities"
  | "Event";

export type ExpenseSource = "manual" | "receipt_scan" | "payment_confirmation";
export type ExpenseStatus = "active" | "flagged" | "edited" | "deleted";

export interface Expense {
  id: string;
  title: string;
  groupId: string;
  paidBy: string;
  amount: number;
  category: ExpenseCategory;
  source: ExpenseSource;
  status: ExpenseStatus;
  ocrConfidence: number;
  createdAt: string;
  merchant: string;
  splitBetween: string[];
  receiptImage?: string;
  extractionNotes: string[];
}
