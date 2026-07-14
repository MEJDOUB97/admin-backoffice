import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import EmptyState from "@/components/common/EmptyState";
import LoadingState from "@/components/common/LoadingState";
import MoneyAmount from "@/components/common/MoneyAmount";
import StatusBadge from "@/components/common/StatusBadge";
import SettlementGraph from "@/components/hssabna/SettlementGraph";
import { api } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import { settlements, users } from "@/lib/mock-data";

export default function GroupDetailPage() {
  const { id = "" } = useParams();
  const queryClient = useQueryClient();
  const [actionState, setActionState] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isRefreshingBalances, setIsRefreshingBalances] = useState(false);
  const [isExportingLedger, setIsExportingLedger] = useState(false);
  const [isFreezingGroup, setIsFreezingGroup] = useState(false);
  const [showFreezeReason, setShowFreezeReason] = useState(false);
  const [freezeReason, setFreezeReason] = useState("");
  const { data: group, isLoading: isGroupLoading, isError: isGroupError, refetch } = useQuery({
    queryKey: ["group", id],
    queryFn: () => api.getGroupById(id),
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

  const memberRecords = group.members ?? [];
  const groupExpenses = group.expenses ?? [];
  const isFrozen = group.status === "frozen";

  const handleRefreshBalances = async () => {
    setIsRefreshingBalances(true);
    setActionState(null);

    try {
      const result = await refetch();

      if (result.error || !result.data) {
        throw result.error ?? new Error("Group refresh failed");
      }

      setActionState({ type: "success", message: "Balances refreshed from latest expenses." });
    } catch {
      setActionState({ type: "error", message: "Unable to refresh balances right now." });
    } finally {
      setIsRefreshingBalances(false);
    }
  };

  const handleExportLedger = () => {
    setIsExportingLedger(true);
    setActionState(null);

    try {
      exportGroupLedgerCsv(group);
      setActionState({ type: "success", message: "Ledger CSV exported." });
    } catch {
      setActionState({ type: "error", message: "Unable to export ledger CSV." });
    } finally {
      setIsExportingLedger(false);
    }
  };

  const handleFreezeGroup = async () => {
    const reason = freezeReason.trim();

    if (reason.length < 10) {
      setActionState({ type: "error", message: "Freeze reason must be at least 10 characters." });
      return;
    }

    setIsFreezingGroup(true);
    setActionState(null);

    try {
      const updatedGroup = await api.freezeGroup(group.id, reason);

      if (!updatedGroup) {
        throw new Error("Group not found");
      }

      queryClient.setQueryData(["group", id], updatedGroup);
      setShowFreezeReason(false);
      setFreezeReason("");
      setActionState({ type: "success", message: "Group frozen and audit log recorded." });
    } catch {
      setActionState({ type: "error", message: "Unable to freeze group right now." });
    } finally {
      setIsFreezingGroup(false);
    }
  };

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
              {group.description ? <p className="mt-2 text-sm text-muted-foreground">{group.description}</p> : null}
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
              <p className="mt-2 text-xl font-semibold">Not available</p>
            </div>
            <div className="rounded-2xl border border-border p-4">
              <p className="subtle-text">Created date</p>
              <p className="mt-2 text-sm font-medium text-muted-foreground">{group.createdAt ? formatDateTime(group.createdAt) : "Not available"}</p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-border p-4">
              <p className="subtle-text">Members</p>
              <p className="mt-2 text-2xl font-semibold">{group.membersCount ?? group.memberIds.length}</p>
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
          <div className="mt-5">
            <h3 className="section-title">Admin actions</h3>
            <div className="mt-3 flex flex-wrap gap-3">
              <button
                className="rounded-2xl border border-border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:bg-muted/40 disabled:text-muted-foreground disabled:opacity-70"
                disabled={isFrozen || isFreezingGroup}
                onClick={() => {
                  setActionState(null);
                  setShowFreezeReason(true);
                }}
                title={isFrozen ? "Group is already frozen" : "Requires a reason and writes an admin audit log"}
                type="button"
              >
                {isFreezingGroup ? "Freezing..." : isFrozen ? "Frozen" : "Freeze group"}
              </button>
              <button
                className="cursor-not-allowed rounded-2xl border border-border bg-muted/40 px-4 py-2 text-sm text-muted-foreground opacity-70"
                disabled
                title="Coming later: invite links are not implemented"
                type="button"
              >
                Disable invite link
              </button>
              <button
                className="rounded-2xl border border-border px-4 py-2 text-sm disabled:cursor-wait disabled:opacity-60"
                disabled={isRefreshingBalances}
                onClick={handleRefreshBalances}
                title="Balances are calculated from expenses"
                type="button"
              >
                {isRefreshingBalances ? "Refreshing..." : "Recalculate balances"}
              </button>
              <button
                className="rounded-2xl border border-border px-4 py-2 text-sm disabled:cursor-wait disabled:opacity-60"
                disabled={isExportingLedger}
                onClick={handleExportLedger}
                type="button"
              >
                {isExportingLedger ? "Exporting..." : "Export ledger"}
              </button>
            </div>
            {actionState ? (
              <p className={`mt-3 text-sm ${actionState.type === "success" ? "text-emerald-600" : "text-destructive"}`}>
                {actionState.message}
              </p>
            ) : null}
            {showFreezeReason && !isFrozen ? (
              <div className="mt-4 rounded-2xl border border-border bg-background/60 p-4">
                <label className="text-sm font-medium" htmlFor="freeze-reason">
                  Freeze reason
                </label>
                <textarea
                  className="mt-2 min-h-24 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  disabled={isFreezingGroup}
                  id="freeze-reason"
                  onChange={(event) => setFreezeReason(event.target.value)}
                  placeholder="Explain why this group must be frozen."
                  value={freezeReason}
                />
                <div className="mt-3 flex flex-wrap gap-3">
                  <button
                    className="rounded-2xl border border-border px-4 py-2 text-sm disabled:cursor-wait disabled:opacity-60"
                    disabled={isFreezingGroup}
                    onClick={handleFreezeGroup}
                    type="button"
                  >
                    {isFreezingGroup ? "Freezing..." : "Confirm freeze"}
                  </button>
                  <button
                    className="rounded-2xl border border-border px-4 py-2 text-sm disabled:cursor-wait disabled:opacity-60"
                    disabled={isFreezingGroup}
                    onClick={() => {
                      setShowFreezeReason(false);
                      setFreezeReason("");
                    }}
                    type="button"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : null}
            <p className="mt-3 text-sm text-muted-foreground">
              Disabled actions require audit-safe backend endpoints before they can be enabled.
            </p>
            {isFrozen ? (
              <div className="mt-4 rounded-2xl border border-border bg-muted/30 p-4 text-sm">
                <p className="font-medium">Freeze audit</p>
                <p className="mt-2 text-muted-foreground">
                  Frozen {group.frozenAt ? formatDateTime(group.frozenAt) : "date not available"}.
                </p>
                <p className="mt-1 text-muted-foreground">
                  Reason: {group.frozenReason || "Not available"}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="panel p-6">
          <h3 className="section-title">Members</h3>
          <div className="mt-4 space-y-3">
            {memberRecords.length === 0 ? (
              <EmptyState title="No members found" description="This group has no members returned by the backend." />
            ) : memberRecords.map((member) => (
              <div key={member.id} className="rounded-2xl border border-border bg-background/60 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{member.name}</p>
                  <StatusBadge value={member.role === "CREATOR" ? "verified" : "active"} />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{member.email || "No email"} - {member.role}</p>
                <p className="mt-1 text-xs text-muted-foreground">Total paid: <MoneyAmount amount={member.totalPaid} /></p>
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
            {groupExpenses.length === 0 ? (
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
                        <td className="px-3 py-3 align-top">{expense.payerName ?? expense.paidBy}</td>
                        <td className="px-3 py-3 align-top">
                          <MoneyAmount amount={expense.amount} />
                        </td>
                        <td className="px-3 py-3 align-top">{expense.category}</td>
                        <td className="px-3 py-3 align-top capitalize">{expense.source.replace(/_/g, " ")}</td>
                        <td className="px-3 py-3 align-top">
                          <StatusBadge value={expense.status} />
                        </td>
                        <td className="px-3 py-3 align-top">{expense.createdAt ? formatDateTime(expense.createdAt) : "Not available"}</td>
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

    </div>
  );
}

function exportGroupLedgerCsv(group: NonNullable<Awaited<ReturnType<typeof api.getGroupById>>>) {
  const headers = [
    "section",
    "groupId",
    "groupName",
    "groupTotalAmount",
    "memberId",
    "memberName",
    "memberEmail",
    "memberRole",
    "expenseId",
    "expenseTitle",
    "payerName",
    "amount",
    "date",
    "status",
  ];

  const rows: Array<Array<string | number | null | undefined>> = [];

  if (group.members?.length) {
    group.members.forEach((member) => {
      rows.push([
        "member",
        group.id,
        group.name,
        group.totalVolume,
        member.id,
        member.name,
        member.email,
        member.role,
        "",
        "",
        "",
        String(member.totalPaid),
        "",
        "",
      ]);
    });
  }

  if (group.expenses?.length) {
    group.expenses.forEach((expense) => {
      rows.push([
        "expense",
        group.id,
        group.name,
        group.totalVolume,
        "",
        "",
        "",
        "",
        expense.id,
        expense.title,
        expense.payerName ?? expense.paidBy,
        String(expense.amount),
        expense.createdAt,
        expense.status,
      ]);
    });
  }

  if (rows.length === 0) {
    rows.push(["group", group.id, group.name, group.totalVolume, "", "", "", "", "", "", "", "0", "", ""]);
  }

  const csv = [headers, ...rows]
    .map((row) => row.map(escapeCsvValue).join(","))
    .join("\r\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `hssabna-group-${group.id}-ledger.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function escapeCsvValue(value: string | number | null | undefined) {
  const text = value == null ? "" : String(value);
  const escaped = text.replace(/"/g, '""');
  return /[",\r\n]/.test(escaped) ? `"${escaped}"` : escaped;
}
