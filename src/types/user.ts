import type { Group } from "@/types/group";

export type UserStatus = "active" | "blocked" | "verified" | "suspicious" | "new";
export type Platform = "iOS" | "Android" | "Unknown";

export interface User {
  id: string;
  username?: string | null;
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
  groups?: Group[];
  role?: string | null;
  currencyCode?: string | null;
  onboardingCompleted?: boolean | null;
  onboardingStep?: number | null;
  groupsCount?: number;
  expensesCount?: number;
  friendsCount?: number;
}
