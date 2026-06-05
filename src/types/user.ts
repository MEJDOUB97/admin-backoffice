export type UserStatus = "active" | "blocked" | "verified" | "suspicious" | "new";
export type Platform = "iOS" | "Android";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  platform: Platform;
  appVersion: string;
  status: UserStatus;
  riskScore: number;
  totalPaid: number;
  totalOwed: number;
  lastActive: string;
  joinedAt: string;
  avatar: string;
  trusted: boolean;
  device: string;
  notes: string[];
}
