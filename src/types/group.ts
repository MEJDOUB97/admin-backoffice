export type GroupType = "dinner" | "trip" | "roommates" | "rent" | "taxi" | "custom";
export type GroupStatus = "healthy" | "watch" | "frozen";

export interface Group {
  id: string;
  name: string;
  description?: string;
  type: GroupType;
  memberIds: string[];
  membersCount?: number;
  expensesCount?: number;
  totalVolume: number;
  unsettledAmount: number;
  healthScore: number;
  status: GroupStatus;
  inviteLinkActive: boolean;
  createdAt?: string | null;
  creatorName?: string | null;
  frozenAt?: string | null;
  frozenReason?: string | null;
  members?: GroupMember[];
  expenses?: GroupExpense[];
}

export interface GroupMember {
  id: string;
  name: string;
  email: string;
  username?: string | null;
  role: string;
  totalPaid: number;
}

export interface GroupExpense {
  id: string;
  title: string;
  groupId: string;
  paidBy: string;
  payerName?: string;
  amount: number;
  payerId: string;
  category: "Event";
  source: "manual";
  status: "active";
  ocrConfidence: number;
  createdAt: string;
  merchant: string;
  splitBetween: string[];
  extractionNotes: string[];
}
