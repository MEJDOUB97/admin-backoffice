import { ReactNode } from "react";
import { hasPermission } from "@/lib/permissions";
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
  const permissions = useAuthStore((state) => state.admin?.permissions ?? []);
  return hasPermission(permissions, permission) ? <>{children}</> : <>{fallback}</>;
}
