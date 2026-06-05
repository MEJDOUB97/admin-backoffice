import { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import PermissionGate from "@/components/common/PermissionGate";
import ReasonRequiredDialog from "@/components/common/ReasonRequiredDialog";
import RiskBadge from "@/components/common/RiskBadge";
import StatusBadge from "@/components/common/StatusBadge";
import DataTable from "@/components/tables/DataTable";
import { api } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import type { User } from "@/types/user";

export default function UsersPage() {
  const { data = [] } = useQuery({ queryKey: ["users"], queryFn: api.getUsers });
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        cell: ({ row }) => <Link className="font-medium text-primary" to={`/admin/users/${row.original.id}`}>{row.original.name}</Link>,
      },
      { header: "Phone / Email", cell: ({ row }) => <div><div>{row.original.phone}</div><div className="text-xs text-muted-foreground">{row.original.email}</div></div> },
      { header: "City", accessorKey: "city" },
      { header: "Platform", accessorKey: "platform" },
      { header: "App version", accessorKey: "appVersion" },
      { header: "Status", cell: ({ row }) => <StatusBadge value={row.original.status} /> },
      { header: "Risk", cell: ({ row }) => <RiskBadge score={row.original.riskScore} /> },
      { header: "Last active", cell: ({ row }) => formatDateTime(row.original.lastActive) },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {["Active", "Blocked", "Verified", "Suspicious", "New users", "High-value users"].map((filter) => (
          <span key={filter} className="rounded-full border border-border px-3 py-1.5 text-sm">{filter}</span>
        ))}
      </div>
      <DataTable columns={columns} data={data} searchPlaceholder="Search users by name, city, email..." />
      <div className="panel p-5">
        <div className="flex flex-wrap gap-3">
          <PermissionGate permission="users.block">
            <button className="rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground" onClick={() => setSelectedAction("Block user")}>Block user</button>
          </PermissionGate>
          <PermissionGate permission="users.block">
            <button className="rounded-2xl border border-border px-4 py-2 text-sm" onClick={() => setSelectedAction("Anonymize user")}>Anonymize user</button>
          </PermissionGate>
        </div>
      </div>
      <ReasonRequiredDialog
        title={selectedAction ?? "Sensitive action"}
        description="Sensitive user actions must include an internal reason for the audit log."
        open={Boolean(selectedAction)}
        onOpenChange={(open) => !open && setSelectedAction(null)}
        onConfirm={(reason) => toast.success(`${selectedAction} recorded`, { description: reason })}
      />
    </div>
  );
}
