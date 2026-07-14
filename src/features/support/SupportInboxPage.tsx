import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import EmptyState from "@/components/common/EmptyState";
import LoadingState from "@/components/common/LoadingState";
import StatusBadge from "@/components/common/StatusBadge";
import DataTable from "@/components/tables/DataTable";
import { api } from "@/lib/api";

export default function SupportInboxPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const { data = [], isLoading, isError } = useQuery({
    queryKey: ["support", statusFilter, priorityFilter, categoryFilter],
    queryFn: () => api.getSupportTickets({
      status: statusFilter,
      priority: priorityFilter,
      category: categoryFilter,
    }),
  });

  if (isLoading) {
    return <LoadingState label="Loading support tickets..." />;
  }

  if (isError) {
    return (
      <EmptyState
        title="Unable to load support tickets"
        description="Support tickets could not be loaded from the backend right now."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="panel p-5 text-sm">
        <strong>Support scope:</strong> Hssabna Support helps with technical issues, account access, app usage, receipts/OCR, and feature requests. Support cannot decide real-world payment disputes or force users to pay.
      </div>
      <div className="panel p-5 text-sm">
        <p className="font-medium">Support handles technical/account/app issues. It does not arbitrate payment disputes.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <select
            className="rounded-2xl border border-border bg-background px-4 py-2.5 text-sm"
            onChange={(event) => setStatusFilter(event.target.value)}
            value={statusFilter}
          >
            <option value="">All statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="CLOSED">Closed</option>
          </select>
          <select
            className="rounded-2xl border border-border bg-background px-4 py-2.5 text-sm"
            onChange={(event) => setPriorityFilter(event.target.value)}
            value={priorityFilter}
          >
            <option value="">All priorities</option>
            <option value="LOW">Low</option>
            <option value="NORMAL">Normal</option>
            <option value="HIGH">High</option>
          </select>
          <select
            className="rounded-2xl border border-border bg-background px-4 py-2.5 text-sm"
            onChange={(event) => setCategoryFilter(event.target.value)}
            value={categoryFilter}
          >
            <option value="">All categories</option>
            {supportCategories.map((category) => (
              <option key={category} value={category}>{formatCategory(category)}</option>
            ))}
          </select>
        </div>
      </div>
      {data.length === 0 ? (
        <EmptyState title="No support tickets found" description="No contact messages have been submitted yet." />
      ) : (
        <DataTable
          data={data}
          columns={[
            {
              header: "Ticket",
              cell: ({ row }) => (
                <div>
                  <p className="font-medium">{row.original.subject}</p>
                  <p className="mt-1 max-w-xl text-xs text-muted-foreground">{row.original.message || "No preview available"}</p>
                </div>
              ),
            },
            { header: "Email", accessorKey: "email" },
            { header: "Category", cell: ({ row }) => <StatusBadge value={formatCategory(row.original.category ?? "GENERAL_HELP").toLowerCase()} /> },
            { header: "Priority", accessorKey: "priority" },
            { header: "Status", cell: ({ row }) => <StatusBadge value={row.original.status} /> },
            { header: "Source", accessorKey: "source" },
            { header: "Created", accessorKey: "createdAt" },
          ]}
          searchPlaceholder="Search support tickets..."
        />
      )}
    </div>
  );
}

const supportCategories = [
  "TECHNICAL_ISSUE",
  "ACCOUNT_LOGIN",
  "EMAIL_VERIFICATION",
  "GOOGLE_LOGIN",
  "EXPENSE_BUG",
  "GROUP_BUG",
  "BALANCE_DISPLAY_ISSUE",
  "OCR_RECEIPT_ISSUE",
  "DATA_EXPORT_REQUEST",
  "FEATURE_REQUEST",
  "GENERAL_HELP",
  "USER_DISPUTE_GUIDANCE",
];

function formatCategory(category: string) {
  return category.toLowerCase().replace(/_/g, " ");
}
