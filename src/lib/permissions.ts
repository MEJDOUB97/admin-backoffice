import type { AdminRole, Permission } from "@/types/admin";

export const roleLabels: Record<AdminRole, string> = {
  super_admin: "Super Admin",
  operations_admin: "Operations Admin",
  support_agent: "Support Agent",
  finance_reviewer: "Finance Reviewer",
  security_analyst: "Security Analyst",
  content_manager: "Content Manager",
  read_only_analyst: "Read-only Analyst",
};

export const rolePermissions: Record<AdminRole, Permission[]> = {
  super_admin: [
    "users.read",
    "users.write",
    "users.block",
    "groups.read",
    "groups.write",
    "expenses.read",
    "expenses.write",
    "settlements.read",
    "settlements.write",
    "support.read",
    "support.write",
    "config.read",
    "config.write",
    "analytics.read",
    "security.read",
    "security.write",
    "audit.read",
    "admins.manage",
  ],
  operations_admin: [
    "users.read",
    "users.write",
    "groups.read",
    "groups.write",
    "expenses.read",
    "expenses.write",
    "settlements.read",
    "settlements.write",
    "support.read",
    "support.write",
    "analytics.read",
  ],
  support_agent: ["users.read", "groups.read", "expenses.read", "settlements.read", "support.read", "support.write"],
  finance_reviewer: ["users.read", "groups.read", "expenses.read", "settlements.read", "settlements.write", "analytics.read", "audit.read"],
  security_analyst: ["users.read", "users.block", "groups.read", "security.read", "security.write", "audit.read"],
  content_manager: ["support.read", "config.read", "config.write", "analytics.read"],
  read_only_analyst: ["users.read", "groups.read", "expenses.read", "settlements.read", "analytics.read", "audit.read"],
};

export function hasPermission(permissions: Permission[], permission: Permission) {
  return permissions.includes(permission);
}

export function getPermissionsForRole(role?: string) {
  if (role === "ADMIN") {
    return rolePermissions.super_admin;
  }

  return role ? rolePermissions[role] ?? [] : [];
}
