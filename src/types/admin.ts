export type AdminRole =
  | "super_admin"
  | "operations_admin"
  | "support_agent"
  | "finance_reviewer"
  | "security_analyst"
  | "content_manager"
  | "read_only_analyst";

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
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  permissions: Permission[];
  avatar: string;
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
