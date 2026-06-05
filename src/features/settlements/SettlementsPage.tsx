import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import MoneyAmount from "@/components/common/MoneyAmount";
import ReasonRequiredDialog from "@/components/common/ReasonRequiredDialog";
import StatusBadge from "@/components/common/StatusBadge";
import DataTable from "@/components/tables/DataTable";
import { api } from "@/lib/api";

export default function SettlementsPage() {
  const { data = [] } = useQuery({ queryKey: ["settlements"], queryFn: api.getSettlements });
  const [reverseOpen, setReverseOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {["Calculations run 241", "Average transfer reduction 18%", "Failed calculations 3", "Recalculate selected group"].map((item) => (
          <div key={item} className="panel p-5 text-sm">{item}</div>
        ))}
      </div>
      <DataTable
        data={data}
        columns={[
          { header: "From user", accessorKey: "fromUserId" },
          { header: "To user", accessorKey: "toUserId" },
          { header: "Group", accessorKey: "groupId" },
          { header: "Amount MAD", cell: ({ row }) => <MoneyAmount amount={row.original.amount} /> },
          { header: "Status", cell: ({ row }) => <StatusBadge value={row.original.status} /> },
          { header: "Method", accessorKey: "method" },
          { header: "Time to settle", cell: ({ row }) => `${row.original.timeToSettleHours}h` },
        ]}
        searchPlaceholder="Search settlements..."
      />
      <div className="panel p-5">
        <div className="flex flex-wrap gap-3">
          {["Mark resolved", "Open dispute", "Add proof"].map((action) => <button key={action} className="rounded-2xl border border-border px-4 py-2 text-sm">{action}</button>)}
          <button className="rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground" onClick={() => setReverseOpen(true)}>Reverse manual settlement</button>
        </div>
      </div>
      <ReasonRequiredDialog
        title="Reverse manual settlement"
        description="Settlement reversals require a reason for the audit log."
        open={reverseOpen}
        onOpenChange={setReverseOpen}
        onConfirm={(reason) => toast.success("Settlement reversal logged", { description: reason })}
      />
    </div>
  );
}
