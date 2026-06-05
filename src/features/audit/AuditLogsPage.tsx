import { useQuery } from "@tanstack/react-query";
import StatusBadge from "@/components/common/StatusBadge";
import DataTable from "@/components/tables/DataTable";
import { api } from "@/lib/api";
import { formatDateTime } from "@/lib/format";

export default function AuditLogsPage() {
  const { data = [] } = useQuery({ queryKey: ["audit"], queryFn: api.getAuditLogs });

  return (
    <DataTable
      data={data}
      columns={[
        { header: "Actor", accessorKey: "actor" },
        { header: "Action", accessorKey: "action" },
        { header: "Target", accessorKey: "target" },
        { header: "Reason", accessorKey: "reason" },
        { header: "Severity", cell: ({ row }) => <StatusBadge value={row.original.severity} /> },
        { header: "Created", cell: ({ row }) => formatDateTime(row.original.createdAt) },
      ]}
      searchPlaceholder="Search audit logs..."
    />
  );
}
