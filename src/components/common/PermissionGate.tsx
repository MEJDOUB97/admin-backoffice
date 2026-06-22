import { ReactNode } from "react";
import { getPermissionsForRole, hasPermission } from "@/lib/permissions";
import { useAuthStore } from "@/store/authStore";
import type { Permission } from "@/types/admin";

export default function PermissionGate({
  permission,
  fallback = null,
  children,
}: {
  permission: Permission;
  fallback?: ReactNode;
  children: ReactNode;
}) {
  const role = useAuthStore((state) => state.admin?.role);
  const permissions = getPermissionsForRole(role);
  return hasPermission(permissions, permission) ? <>{children}</> : <>{fallback}</>;
}
