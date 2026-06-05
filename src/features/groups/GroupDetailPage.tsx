import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import ReasonRequiredDialog from "@/components/common/ReasonRequiredDialog";
import LoadingState from "@/components/common/LoadingState";
import MoneyAmount from "@/components/common/MoneyAmount";
import SettlementGraph from "@/components/hssabna/SettlementGraph";
import { api } from "@/lib/api";
import { users } from "@/lib/mock-data";

export default function GroupDetailPage() {
  const { id = "" } = useParams();
  const { data: group, isLoading } = useQuery({ queryKey: ["group", id], queryFn: () => api.getGroup(id) });
  const [reasonOpen, setReasonOpen] = useState(false);

  if (isLoading || !group) return <LoadingState label="Loading group detail..." />;

  const memberNames = group.memberIds.map((memberId) => users.find((user) => user.id === memberId)?.name ?? memberId);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="panel p-6 lg:col-span-2">
          <h1 className="text-2xl font-semibold">{group.name}</h1>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-border p-4"><p className="subtle-text">Members</p><p className="mt-2 text-2xl font-semibold">{group.memberIds.length}</p></div>
            <div className="rounded-2xl border border-border p-4"><p className="subtle-text">Total volume</p><MoneyAmount amount={group.totalVolume} className="mt-2 block text-2xl font-semibold" /></div>
            <div className="rounded-2xl border border-border p-4"><p className="subtle-text">Unsettled</p><MoneyAmount amount={group.unsettledAmount} className="mt-2 block text-2xl font-semibold" /></div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button className="rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground" onClick={() => setReasonOpen(true)}>Freeze group</button>
            <button className="rounded-2xl border border-border px-4 py-2 text-sm">Disable invite link</button>
            <button className="rounded-2xl border border-border px-4 py-2 text-sm">Recalculate balances</button>
            <button className="rounded-2xl border border-border px-4 py-2 text-sm">Export ledger</button>
          </div>
        </div>
        <div className="panel p-6">
          <h3 className="section-title">Members</h3>
          <div className="mt-4 space-y-3">
            {memberNames.map((member) => <div key={member} className="rounded-2xl border border-border bg-background/60 p-3">{member}</div>)}
          </div>
        </div>
      </div>
      <SettlementGraph nodes={memberNames.slice(0, 3).map((name, index) => ({ from: name, to: memberNames[(index + 1) % memberNames.length], amount: `${420 + index * 80} MAD` }))} />
      <ReasonRequiredDialog
        title="Freeze group"
        description="Freezing a group is sensitive and should be justified in the audit log."
        open={reasonOpen}
        onOpenChange={setReasonOpen}
        onConfirm={(reason) => toast.success("Group freeze logged", { description: reason })}
      />
    </div>
  );
}
