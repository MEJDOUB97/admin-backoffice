import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import EmptyState from "@/components/common/EmptyState";
import LoadingState from "@/components/common/LoadingState";
import MoneyAmount from "@/components/common/MoneyAmount";
import StatusBadge from "@/components/common/StatusBadge";
import { api } from "@/lib/api";
import { formatDate, formatDateTime } from "@/lib/format";

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
  const groupBalances = group.balances ?? [];
  const groupSettlements = group.settlements ?? [];
  const hasOcrConfidence = groupExpenses.some(
    (expense) =>
      expense.ocrConfidence != null &&
      expense.ocrConfidence > 0 &&
      expense.source?.toLowerCase() !== "manual",
  );
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

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
      <div className="panel p-6 xl:col-span-8">
        <div className="flex flex-col gap-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">{group.name}</h1>
              <p className="mt-2 text-sm text-muted-foreground capitalize">Type: {group.type}</p>
              {group.description ? <p className="mt-2 text-sm text-muted-foreground">{group.description}</p> : null}
            </div>
            <StatusBadge value={group.status} />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex min-h-[92px] flex-col justify-between rounded-2xl border border-border bg-background/50 p-4">
              <p className="subtle-text">Currency</p>
              <p className="mt-2 text-xl font-semibold">MAD</p>
            </div>
            <div className="flex min-h-[92px] flex-col justify-between rounded-2xl border border-border bg-background/50 p-4">
              <p className="subtle-text">Invite link</p>
              <p className="mt-2 text-xl font-semibold">Not available</p>
            </div>
            <div className="flex min-h-[92px] flex-col justify-between rounded-2xl border border-border bg-background/50 p-4">
              <p className="subtle-text">Created date</p>
              <p className="mt-2 text-sm font-medium text-muted-foreground">{group.createdAt ? formatDate(group.createdAt) : "Not available"}</p>
            </div>
            <div className="flex min-h-[92px] flex-col justify-between rounded-2xl border border-border bg-background/50 p-4">
              <p className="subtle-text">Members</p>
              <p className="mt-2 text-2xl font-semibold">{group.membersCount ?? group.memberIds.length}</p>
            </div>
            <div className="flex min-h-[92px] flex-col justify-between rounded-2xl border border-border bg-background/50 p-4">
              <p className="subtle-text">Total volume</p>
              <MoneyAmount amount={group.totalVolume} className="mt-2 block whitespace-nowrap text-2xl font-semibold tabular-nums" />
            </div>
            <div className="flex min-h-[92px] flex-col justify-between rounded-2xl border border-border bg-background/50 p-4">
              <p className="subtle-text">Unsettled amount</p>
              <MoneyAmount amount={group.unsettledAmount} className="mt-2 block whitespace-nowrap text-2xl font-semibold tabular-nums" />
            </div>
          </div>

          <div>
            <h3 className="section-title">Admin actions</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                className="rounded-2xl border border-border px-4 py-2 text-sm transition hover:border-primary/50 disabled:cursor-not-allowed disabled:bg-muted/40 disabled:text-muted-foreground disabled:opacity-70"
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
                className="rounded-2xl border border-border px-4 py-2 text-sm transition hover:border-primary/50 disabled:cursor-wait disabled:opacity-60"
                disabled={isRefreshingBalances}
                onClick={handleRefreshBalances}
                title="Balances are calculated from expenses"
                type="button"
              >
                {isRefreshingBalances ? "Refreshing..." : "Recalculate balances"}
              </button>
              <button
                className="rounded-2xl border border-border px-4 py-2 text-sm transition hover:border-primary/50 disabled:cursor-wait disabled:opacity-60"
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
      </div>

      <div className="panel p-6 xl:col-span-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="section-title">Members</h3>
          <span className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">{memberRecords.length}</span>
        </div>
        <div className="mt-4 max-h-[520px] space-y-3 overflow-y-auto pr-1">
          {memberRecords.length === 0 ? (
            <EmptyState title="No members found" description="This group has no members returned by the backend." />
          ) : memberRecords.map((member) => (
            <div key={member.id} className="rounded-2xl border border-border bg-background/60 p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{member.name}</p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{member.email || "No email"} - {member.role}</p>
                  <p className="mt-2 text-xs text-muted-foreground">Total paid: <MoneyAmount amount={member.totalPaid} /></p>
                </div>
                <StatusBadge value={member.role === "CREATOR" ? "verified" : "active"} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel p-6 xl:col-span-5">
        <h3 className="section-title">Balances</h3>
        <div className="mt-4 space-y-6">
          {groupBalances.length === 0 && groupSettlements.length === 0 ? (
            <EmptyState
              title="No settlements to display"
              description="This group is currently balanced or detailed settlement records are not available yet."
            />
          ) : (
            <>
              {groupSettlements.length > 0 ? (
                <div>
                  <h4 className="text-sm font-semibold">Who owes whom</h4>
                  <div className="mt-3 space-y-3">
                    {groupSettlements.map((settlement) => (
                      <div key={`${settlement.fromUserId}-${settlement.toUserId}-${settlement.amount}`} className="rounded-2xl border border-border bg-background/60 p-4">
                        <div className="flex items-center justify-between gap-4">
                          <p className="min-w-0 text-sm font-medium">
                            {settlement.fromUserName} owes {settlement.toUserName}
                          </p>
                          <MoneyAmount amount={settlement.amount} className="block whitespace-nowrap text-lg font-semibold tabular-nums" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {groupBalances.length > 0 ? (
                <div>
                  <h4 className="text-sm font-semibold">Member balances</h4>
                  <div className="mt-3 space-y-3">
                    {groupBalances.map((balance) => (
                      <div key={balance.userId} className="rounded-2xl border border-border bg-background/60 p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <p className="truncate font-medium">{balance.userName}</p>
                            <p className="mt-1 truncate text-sm text-muted-foreground">{balance.email || "No email"}</p>
                          </div>
                          <div className="shrink-0 text-end">
                            <BalanceState amount={balance.netAmount} />
                            <MoneyAmount amount={Math.abs(balance.netAmount)} className="mt-1 block whitespace-nowrap text-lg font-semibold tabular-nums" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>

      <div className="panel overflow-hidden p-6 xl:col-span-7">
        <div className="flex items-center justify-between gap-3">
          <h3 className="section-title">Group Expenses</h3>
          <span className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">{groupExpenses.length} expenses</span>
        </div>
        <div className="mt-4">
          {groupExpenses.length === 0 ? (
            <EmptyState title="No expenses found for this group." description="There are no tracked expenses inside this group yet." />
          ) : (
            <div className="w-full overflow-x-auto lg:overflow-x-visible">
              <table className="w-full min-w-[640px] table-fixed text-left text-sm lg:min-w-0">
                <thead className="text-muted-foreground">
                  <tr>
                    <th className="w-[22%] border-b border-border py-3 pr-4 font-medium">Title</th>
                    <th className="w-[16%] border-b border-border px-2 py-3 font-medium">Paid by</th>
                    <th className="w-[12%] border-b border-border px-2 py-3 font-medium">Amount</th>
                    <th className="w-[12%] border-b border-border px-2 py-3 font-medium">Category</th>
                    <th className="w-[10%] border-b border-border px-2 py-3 font-medium">Source</th>
                    <th className="w-[10%] border-b border-border px-2 py-3 font-medium">Status</th>
                    <th className="w-[10%] border-b border-border py-3 pl-2 font-medium">Created date</th>
                    {hasOcrConfidence ? (
                      <th className="w-[8%] border-b border-border py-3 pl-2 font-medium">OCR</th>
                    ) : null}
                  </tr>
                </thead>
                <tbody>
                  {groupExpenses.map((expense) => (
                    <tr key={expense.id} className="border-b border-border/60 last:border-0">
                      <td className="py-4 pr-4 align-top">
                        <span className="block truncate">
                          <Link className="inline-flex max-w-full items-center gap-1 font-medium text-primary hover:underline" to={`/admin/expenses/${expense.id}`}>
                            <span className="truncate">{expense.title}</span>
                            <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                          </Link>
                        </span>
                      </td>
                      <td className="px-2 py-4 align-top">
                        <span className="block truncate">{expense.payerName ?? expense.paidBy}</span>
                      </td>
                      <td className="whitespace-nowrap px-2 py-4 align-top">
                        <MoneyAmount amount={expense.amount} />
                      </td>
                      <td className="px-2 py-4 align-top">
                        <span className="block truncate">{expense.category}</span>
                      </td>
                      <td className="whitespace-nowrap px-2 py-4 align-top capitalize">{expense.source.replace(/_/g, " ")}</td>
                      <td className="whitespace-nowrap px-2 py-4 align-top">
                        <StatusBadge value={expense.status} />
                      </td>
                      <td className="whitespace-nowrap py-4 pl-2 align-top">{expense.createdAt ? formatDate(expense.createdAt) : "Not available"}</td>
                      {hasOcrConfidence ? (
                        <td className="whitespace-nowrap py-4 pl-2 align-top">{formatOcrConfidence(expense.source, expense.ocrConfidence)}</td>
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BalanceState({ amount }: { amount: number }) {
  if (amount > 0.005) {
    return <StatusBadge value="to receive" />;
  }
  if (amount < -0.005) {
    return <StatusBadge value="to pay" />;
  }
  return <StatusBadge value="settled" />;
}

function formatOcrConfidence(source: string | null | undefined, confidence: number | null | undefined) {
  if (!source || source.toLowerCase() === "manual" || confidence == null || confidence <= 0) {
    return "-";
  }
  return `${Math.round(confidence)}%`;
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
