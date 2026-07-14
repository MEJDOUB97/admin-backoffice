export type TicketStatus = "open" | "pending" | "escalated" | "resolved";
export type SupportCategory =
  | "TECHNICAL_ISSUE"
  | "ACCOUNT_LOGIN"
  | "EMAIL_VERIFICATION"
  | "GOOGLE_LOGIN"
  | "EXPENSE_BUG"
  | "GROUP_BUG"
  | "BALANCE_DISPLAY_ISSUE"
  | "OCR_RECEIPT_ISSUE"
  | "DATA_EXPORT_REQUEST"
  | "FEATURE_REQUEST"
  | "GENERAL_HELP"
  | "USER_DISPUTE_GUIDANCE";

export interface SupportTicket {
  id: string;
  userId?: string;
  email?: string;
  subject: string;
  message: string;
  status: TicketStatus;
  priority: "low" | "medium" | "high";
  category?: SupportCategory;
  source?: string;
  assignedTo?: string;
  linkedEntity?: string;
  createdAt: string;
}
