import { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "@/components/common/EmptyState";
import LoadingState from "@/components/common/LoadingState";
import StatusBadge from "@/components/common/StatusBadge";
import DataTable from "@/components/tables/DataTable";
import { api } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import type { User } from "@/types/user";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "blocked">("all");
  const { data = [], isError, isLoading, refetch } = useQuery({
    queryKey: ["users", search, status],
    queryFn: () => api.getUsers({ search, status: status === "all" ? undefined : status }),
  });

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        cell: ({ row }) => <Link className="font-medium text-primary" to={`/admin/users/${row.original.id}`}>{row.original.name}</Link>,
      },
      { header: "Phone / Email", cell: ({ row }) => <div><div>{row.original.phone}</div><div className="text-xs text-muted-foreground">{row.original.email}</div></div> },
      { header: "City", accessorKey: "city" },
      { header: "Status", cell: ({ row }) => <StatusBadge value={row.original.status} /> },
      { header: "Role", cell: ({ row }) => row.original.role ?? "USER" },
      { header: "Currency", cell: ({ row }) => row.original.currencyCode ?? "Not set" },
      { header: "Joined", cell: ({ row }) => formatDateTime(row.original.joinedAt) },
    ],
    [],
  );

  if (isError) {
    return (
      <div className="panel flex min-h-56 flex-col items-center justify-center gap-4 p-8 text-center">
        <div>
          <h3 className="text-lg font-semibold">Unable to load users</h3>
          <p className="subtle-text">The admin users API is unavailable. Check that the backend is running, then retry.</p>
        </div>
        <button className="rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" onClick={() => refetch()}>
          Retry
        </button>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingState label="Loading users..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        {[
          { label: "All", value: "all" },
          { label: "Active", value: "active" },
          { label: "Blocked", value: "blocked" },
        ].map((filter) => (
          <button
            key={filter.value}
            className={`rounded-full border px-3 py-1.5 text-sm ${
              status === filter.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground"
            }`}
            onClick={() => setStatus(filter.value as "all" | "active" | "blocked")}
            type="button"
          >
            {filter.label}
          </button>
        ))}
        <span className="rounded-full border border-dashed border-border px-3 py-1.5 text-sm text-muted-foreground" title="Requires more backend user state fields">
          More filters coming later
        </span>
      </div>
      {data.length || search ? (
        <DataTable
          columns={columns}
          data={data}
          globalFilter={search}
          onGlobalFilterChange={setSearch}
          searchPlaceholder="Search users by name, city, email..."
        />
      ) : (
        <EmptyState title="No users found" description="No users matched the current backend query." />
      )}
    </div>
  );
}
