import { rolePermissions } from "@/lib/permissions";
import type { AdminUser } from "@/types/admin";

export const MOCK_ADMIN_CREDENTIALS = {
  email: "admin@hssabna.site",
  password: "admin123",
};

export const mockAdmin: AdminUser = {
  id: "admin-1",
  name: "Yasmine Bennani",
  email: MOCK_ADMIN_CREDENTIALS.email,
  role: "super_admin",
  permissions: rolePermissions.super_admin,
  avatar: "YB",
};

export function validateMockCredentials(email: string, password: string) {
  return email === MOCK_ADMIN_CREDENTIALS.email && password === MOCK_ADMIN_CREDENTIALS.password;
}

// TODO: Replace mock login with real backend authentication and permission claims.
