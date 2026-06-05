import { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import DataTable from "@/components/tables/DataTable";
import MoneyAmount from "@/components/common/MoneyAmount";
import StatusBadge from "@/components/common/StatusBadge";
import { api } from "@/lib/api";
import type { Group } from "@/types/group";

export default function GroupsPage() {
  const { data = [] } = useQuery({ queryKey: ["groups"], queryFn: api.getGroups });

  const columns: ColumnDef<Group>[] = [
    { header: "Name", cell: ({ row }) => <Link className="font-medium text-primary" to={`/admin/groups/${row.original.id}`}>{row.original.name}</Link> },
    { header: "Type", accessorKey: "type" },
    { header: "Members", cell: ({ row }) => row.original.memberIds.length },
    { header: "Total MAD volume", cell: ({ row }) => <MoneyAmount amount={row.original.totalVolume} /> },
    { header: "Unsettled", cell: ({ row }) => <MoneyAmount amount={row.original.unsettledAmount} /> },
    { header: "Health score", cell: ({ row }) => `${row.original.healthScore}/100` },
    { header: "Status", cell: ({ row }) => <StatusBadge value={row.original.status} /> },
  ];

  return <DataTable columns={columns} data={data} searchPlaceholder="Search groups by name or type..." />;
}
