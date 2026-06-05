export type SettlementStatus = "pending" | "completed" | "disputed";

export interface Settlement {
  id: string;
  fromUserId: string;
  toUserId: string;
  groupId: string;
  amount: number;
  status: SettlementStatus;
  method: "cash" | "bank" | "card" | "wallet";
  timeToSettleHours: number;
  createdAt: string;
}
