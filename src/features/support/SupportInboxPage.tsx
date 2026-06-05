import { useQuery } from "@tanstack/react-query";
import StatusBadge from "@/components/common/StatusBadge";
import DataTable from "@/components/tables/DataTable";
import { api } from "@/lib/api";

export default function SupportInboxPage() {
  const { data = [] } = useQuery({ queryKey: ["support"], queryFn: api.getSupportTickets });

  return (
    <div className="space-y-6">
      <div className="panel p-5 text-sm">
        <strong>Money Tension Detector:</strong> messages containing unfair, wrong amount, I paid, receipt wrong, he didn’t pay, she didn’t pay, ana khalest, or ma khlessch are marked high priority.
      </div>
      <DataTable
        data={data}
        columns={[
          { header: "Ticket", accessorKey: "subject" },
          { header: "User", accessorKey: "userId" },
          { header: "Priority", accessorKey: "priority" },
          { header: "Status", cell: ({ row }) => <StatusBadge value={row.original.status} /> },
          { header: "Assigned admin", accessorKey: "assignedTo" },
          { header: "Linked entity", accessorKey: "linkedEntity" },
        ]}
        searchPlaceholder="Search support tickets..."
      />
    </div>
  );
}
