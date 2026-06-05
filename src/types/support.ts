export type TicketStatus = "open" | "pending" | "escalated" | "resolved";

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: TicketStatus;
  priority: "low" | "medium" | "high";
  assignedTo?: string;
  linkedEntity?: string;
  createdAt: string;
}
