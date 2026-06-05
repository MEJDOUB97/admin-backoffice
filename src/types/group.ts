export type GroupType = "dinner" | "trip" | "roommates" | "rent" | "taxi" | "custom";
export type GroupStatus = "healthy" | "watch" | "frozen";

export interface Group {
  id: string;
  name: string;
  type: GroupType;
  memberIds: string[];
  totalVolume: number;
  unsettledAmount: number;
  healthScore: number;
  status: GroupStatus;
  inviteLinkActive: boolean;
}
