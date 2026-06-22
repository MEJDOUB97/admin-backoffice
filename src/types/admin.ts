export type AdminRole = string;

export type Permission =
  | "users.read"
  | "users.write"
  | "users.block"
  | "groups.read"
  | "groups.write"
  | "expenses.read"
  | "expenses.write"
  | "settlements.read"
  | "settlements.write"
  | "support.read"
  | "support.write"
  | "config.read"
  | "config.write"
  | "analytics.read"
  | "security.read"
  | "security.write"
  | "audit.read"
  | "admins.manage";

export interface AdminUser {
  id: number;
  email: string;
  username: string;
  role: AdminRole;
}

export interface AdminLoginResponse {
  token: string;
  user: AdminUser;
}

export interface AuditEvent {
  id: string;
  actor: string;
  action: string;
  target: string;
  reason?: string;
  createdAt: string;
  severity: "low" | "medium" | "high";
}
