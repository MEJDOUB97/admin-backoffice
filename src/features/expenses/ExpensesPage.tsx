import { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import MoneyAmount from "@/components/common/MoneyAmount";
import StatusBadge from "@/components/common/StatusBadge";
import DataTable from "@/components/tables/DataTable";
import { api } from "@/lib/api";
import type { Expense } from "@/types/expense";

export default function ExpensesPage() {
  const { data = [] } = useQuery({ queryKey: ["expenses"], queryFn: api.getExpenses });
  const columns: ColumnDef<Expense>[] = [
    { header: "Title", cell: ({ row }) => <Link className="font-medium text-primary" to={`/admin/expenses/${row.original.id}`}>{row.original.title}</Link> },
    { header: "Group", accessorKey: "groupId" },
    { header: "Paid by", accessorKey: "paidBy" },
    { header: "Amount MAD", cell: ({ row }) => <MoneyAmount amount={row.original.amount} /> },
    { header: "Category", accessorKey: "category" },
    { header: "Source", accessorKey: "source" },
    { header: "Status", cell: ({ row }) => <StatusBadge value={row.original.status} /> },
    { header: "OCR confidence", cell: ({ row }) => `${row.original.ocrConfidence}%` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {["Category", "Amount range", "Source", "Flagged", "Edited", "Deleted"].map((filter) => <span key={filter} className="rounded-full border border-border px-3 py-1.5 text-sm">{filter}</span>)}
      </div>
      <DataTable columns={columns} data={data} searchPlaceholder="Search expenses..." />
    </div>
  );
}
