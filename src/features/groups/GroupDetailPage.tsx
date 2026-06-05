import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import EmptyState from "@/components/common/EmptyState";
import LoadingState from "@/components/common/LoadingState";
import MoneyAmount from "@/components/common/MoneyAmount";
import ReasonRequiredDialog from "@/components/common/ReasonRequiredDialog";
import StatusBadge from "@/components/common/StatusBadge";
import SettlementGraph from "@/components/hssabna/SettlementGraph";
import { api } from "@/lib/api";
import { formatDate, formatDateTime } from "@/lib/format";
import { settlements, users } from "@/lib/mock-data";

export default function GroupDetailPage() {
  const { id = "" } = useParams();
  const [reasonOpen, setReasonOpen] = useState(false);
  const { data: group, isLoading: isGroupLoading, isError: isGroupError } = useQuery({
    queryKey: ["group", id],
    queryFn: () => api.getGroupById(id),
  });
  const { data: groupExpenses = [], isLoading: areExpensesLoading, isError: areExpensesError } = useQuery({
    queryKey: ["group-expenses", id],
    queryFn: () => api.getExpensesByGroupId(id),
    enabled: Boolean(id),
  });

  if (isGroupLoading) {
    return <LoadingState label="Loading group detail..." />;
  }

  if (isGroupError) {
    return <EmptyState title="Unable to load group" description="The selected group could not be loaded right now." />;
  }

  if (!group) {
    return <EmptyState title="Group not found" description="The selected group does not exist in the current admin dataset." />;
  }

  const memberRecords = group.memberIds
    .map((memberId) => users.find((user) => user.id === memberId))
    .filter((member): member is NonNullable<typeof member> => Boolean(member));

  const balanceEdges = settlements
    .filter((settlement) => settlement.groupId === group.id)
    .map((settlement) => ({
      from: users.find((user) => user.id === settlement.fromUserId)?.name ?? settlement.fromUserId,
      to: users.find((user) => user.id === settlement.toUserId)?.name ?? settlement.toUserId,
      amount: `${settlement.amount} MAD`,
    }));

  const settleSummary = balanceEdges.length
    ? balanceEdges
    : [{ from: "Open group balance", to: "Settlement pending", amount: `${group.unsettledAmount} MAD` }];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="panel p-6 lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">{group.name}</h1>
              <p className="mt-2 text-sm text-muted-foreground capitalize">Type: {group.type}</p>
            </div>
            <StatusBadge value={group.status} />
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-border p-4">
              <p className="subtle-text">Currency</p>
              <p className="mt-2 text-xl font-semibold">MAD</p>
            </div>
            <div className="rounded-2xl border border-border p-4">
              <p className="subtle-text">Invite link</p>
              <p className="mt-2 text-xl font-semibold">{group.inviteLinkActive ? "Active" : "Disabled"}</p>
            </div>
            <div className="rounded-2xl border border-border p-4">
              <p className="subtle-text">Created date</p>
              <p className="mt-2 text-sm font-medium text-muted-foreground">Not available in mock data</p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-border p-4">
              <p className="subtle-text">Members</p>
              <p className="mt-2 text-2xl font-semibold">{group.memberIds.length}</p>
            </div>
            <div className="rounded-2xl border border-border p-4">
              <p className="subtle-text">Total volume</p>
              <MoneyAmount amount={group.totalVolume} className="mt-2 block text-2xl font-semibold" />
            </div>
            <div className="rounded-2xl border border-border p-4">
              <p className="subtle-text">Unsettled amount</p>
              <MoneyAmount amount={group.unsettledAmount} className="mt-2 block text-2xl font-semibold" />
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button className="rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground" onClick={() => setReasonOpen(true)}>
              Freeze group
            </button>
            <button className="rounded-2xl border border-border px-4 py-2 text-sm">Disable invite link</button>
            <button className="rounded-2xl border border-border px-4 py-2 text-sm">Recalculate balances</button>
            <button className="rounded-2xl border border-border px-4 py-2 text-sm">Export ledger</button>
          </div>
        </div>

        <div className="panel p-6">
          <h3 className="section-title">Members</h3>
          <div className="mt-4 space-y-3">
            {memberRecords.map((member) => (
              <div key={member.id} className="rounded-2xl border border-border bg-background/60 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{member.name}</p>
                  <StatusBadge value={member.status} />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{member.city} - {member.platform} - {member.appVersion}</p>
                <p className="mt-1 text-xs text-muted-foreground">App join date: {formatDate(member.joinedAt)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <SettlementGraph nodes={settleSummary} />
          <div className="panel p-6">
            <h3 className="section-title">Balances</h3>
            <div className="mt-4">
              {balanceEdges.length === 0 ? (
                <EmptyState
                  title="No balance records available"
                  description="Detailed who-owes-whom records are not stored in the current mock data, so only the unsettled summary is available."
                />
              ) : (
                <div className="space-y-3">
                  {settlements
                    .filter((settlement) => settlement.groupId === group.id)
                    .map((settlement) => (
                      <div key={settlement.id} className="rounded-2xl border border-border bg-background/60 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="font-medium">
                              {users.find((user) => user.id === settlement.fromUserId)?.name ?? settlement.fromUserId} owes{" "}
                              {users.find((user) => user.id === settlement.toUserId)?.name ?? settlement.toUserId}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">Method: {settlement.method} - Created {formatDateTime(settlement.createdAt)}</p>
                          </div>
                          <div className="text-end">
                            <MoneyAmount amount={settlement.amount} className="block text-lg font-semibold" />
                            <StatusBadge value={settlement.status} />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="panel p-6">
          <div className="flex items-center justify-between gap-3">
            <h3 className="section-title">Group Expenses</h3>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">{groupExpenses.length} expenses</span>
          </div>
          <div className="mt-4">
            {areExpensesLoading ? (
              <LoadingState label="Loading group expenses..." />
            ) : areExpensesError ? (
              <EmptyState title="Unable to load expenses" description="Group expenses could not be loaded right now." />
            ) : groupExpenses.length === 0 ? (
              <EmptyState title="No expenses found for this group." description="There are no tracked expenses inside this group yet." />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="text-muted-foreground">
                    <tr>
                      <th className="border-b border-border px-3 py-3 font-medium">Title</th>
                      <th className="border-b border-border px-3 py-3 font-medium">Paid by</th>
                      <th className="border-b border-border px-3 py-3 font-medium">Amount</th>
                      <th className="border-b border-border px-3 py-3 font-medium">Category</th>
                      <th className="border-b border-border px-3 py-3 font-medium">Source</th>
                      <th className="border-b border-border px-3 py-3 font-medium">Status</th>
                      <th className="border-b border-border px-3 py-3 font-medium">Created date</th>
                      <th className="border-b border-border px-3 py-3 font-medium">OCR confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupExpenses.map((expense) => (
                      <tr key={expense.id} className="border-b border-border/60 last:border-0">
                        <td className="px-3 py-3 align-top">
                          <Link className="inline-flex items-center gap-1 font-medium text-primary hover:underline" to={`/admin/expenses/${expense.id}`}>
                            {expense.title}
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        </td>
                        <td className="px-3 py-3 align-top">{users.find((user) => user.id === expense.paidBy)?.name ?? expense.paidBy}</td>
                        <td className="px-3 py-3 align-top">
                          <MoneyAmount amount={expense.amount} />
                        </td>
                        <td className="px-3 py-3 align-top">{expense.category}</td>
                        <td className="px-3 py-3 align-top capitalize">{expense.source.replace(/_/g, " ")}</td>
                        <td className="px-3 py-3 align-top">
                          <StatusBadge value={expense.status} />
                        </td>
                        <td className="px-3 py-3 align-top">{formatDateTime(expense.createdAt)}</td>
                        <td className="px-3 py-3 align-top">{expense.ocrConfidence}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

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
