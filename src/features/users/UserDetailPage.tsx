import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import PermissionGate from "@/components/common/PermissionGate";
import RiskBadge from "@/components/common/RiskBadge";
import StatusBadge from "@/components/common/StatusBadge";
import MoneyAmount from "@/components/common/MoneyAmount";
import LoadingState from "@/components/common/LoadingState";
import { api } from "@/lib/api";
import { groups } from "@/lib/mock-data";

export default function UserDetailPage() {
  const { id = "" } = useParams();
  const { data: user, isLoading } = useQuery({ queryKey: ["user", id], queryFn: () => api.getUser(id) });

  if (isLoading || !user) {
    return <LoadingState label="Loading user profile..." />;
  }

  const relatedGroups = groups.filter((group) => group.memberIds.includes(user.id));

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="space-y-6">
        <div className="panel p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-xl font-semibold text-primary">{user.avatar}</div>
            <div>
              <h1 className="text-2xl font-semibold">{user.name}</h1>
              <p className="subtle-text">{user.city} • {user.device}</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <StatusBadge value={user.status} />
            <RiskBadge score={user.riskScore} />
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border p-4"><p className="subtle-text">Total paid</p><MoneyAmount amount={user.totalPaid} className="mt-2 block text-2xl font-semibold" /></div>
            <div className="rounded-2xl border border-border p-4"><p className="subtle-text">Total owed</p><MoneyAmount amount={user.totalOwed} className="mt-2 block text-2xl font-semibold" /></div>
          </div>
          <PermissionGate permission="users.write">
            <div className="mt-5 flex flex-wrap gap-3">
              <button className="rounded-2xl border border-border px-4 py-2 text-sm">Force logout</button>
              <button className="rounded-2xl border border-border px-4 py-2 text-sm">Reset verification</button>
              <button className="rounded-2xl border border-border px-4 py-2 text-sm">Mark trusted</button>
              <button className="rounded-2xl border border-border px-4 py-2 text-sm">Export user data</button>
            </div>
          </PermissionGate>
        </div>
        <div className="panel p-6">
          <h3 className="section-title">Internal admin notes</h3>
          <div className="mt-4 space-y-3">
            {user.notes.map((note) => <div key={note} className="rounded-2xl border border-border bg-background/60 p-3 text-sm">{note}</div>)}
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div className="panel p-6">
          <h3 className="section-title">Groups joined</h3>
          <div className="mt-4 space-y-3">
            {relatedGroups.map((group) => <div key={group.id} className="rounded-2xl border border-border bg-background/60 p-4">{group.name}</div>)}
          </div>
        </div>
        <div className="panel p-6">
          <h3 className="section-title">Audit timeline</h3>
          <div className="mt-4 space-y-4">
            {["Verification reset requested by support", "Joined Agadir Surf Trip", "Shared first receipt scan"].map((event) => (
              <div key={event} className="border-s-2 border-primary/40 ps-4 text-sm text-muted-foreground">{event}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
