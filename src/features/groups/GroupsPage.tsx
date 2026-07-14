import { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "@/components/common/EmptyState";
import LoadingState from "@/components/common/LoadingState";
import DataTable from "@/components/tables/DataTable";
import MoneyAmount from "@/components/common/MoneyAmount";
import StatusBadge from "@/components/common/StatusBadge";
import { api } from "@/lib/api";
import type { Group } from "@/types/group";

export default function GroupsPage() {
  const [search, setSearch] = useState("");
  const { data = [], isError, isLoading, refetch } = useQuery({
    queryKey: ["groups", search],
    queryFn: () => api.getGroups({ search }),
  });

  const columns: ColumnDef<Group>[] = [
    { header: "Name", cell: ({ row }) => <Link className="font-medium text-primary" to={`/admin/groups/${row.original.id}`}>{row.original.name}</Link> },
    { header: "Type", accessorKey: "type" },
    { header: "Members", cell: ({ row }) => row.original.memberIds.length },
    { header: "Total MAD volume", cell: ({ row }) => <MoneyAmount amount={row.original.totalVolume} /> },
    { header: "Unsettled", cell: ({ row }) => <MoneyAmount amount={row.original.unsettledAmount} /> },
    { header: "Health score", cell: ({ row }) => `${row.original.healthScore}/100` },
    { header: "Status", cell: ({ row }) => <StatusBadge value={row.original.status} /> },
  ];

  if (isError) {
    return (
      <div className="panel flex min-h-56 flex-col items-center justify-center gap-4 p-8 text-center">
        <div>
          <h3 className="text-lg font-semibold">Unable to load groups</h3>
          <p className="subtle-text">The admin groups API is unavailable. Check that the backend is running, then retry.</p>
        </div>
        <button className="rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" onClick={() => refetch()}>
          Retry
        </button>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingState label="Loading groups..." />;
  }

  return data.length || search ? (
    <DataTable
      columns={columns}
      data={data}
      globalFilter={search}
      onGlobalFilterChange={setSearch}
      searchPlaceholder="Search groups by name or type..."
    />
  ) : (
    <EmptyState title="No groups found" description="No groups were returned by the admin groups API." />
  );
}
