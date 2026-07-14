import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import EmptyState from "@/components/common/EmptyState";
import LoadingState from "@/components/common/LoadingState";
import StatusBadge from "@/components/common/StatusBadge";
import { formatCompactNumber, formatDateTime } from "@/lib/format";
import { api } from "@/lib/api";

type SecurityResponse = Awaited<ReturnType<typeof api.getSecurity>>;
type SecurityRiskItem = SecurityResponse["riskItems"][number];

const severityOrder: Record<string, number> = {
  HIGH: 0,
  MEDIUM: 1,
  LOW: 2,
};

export default function SecurityPage() {
  const { data, isError, isLoading, refetch } = useQuery({ queryKey: ["security"], queryFn: api.getSecurity });

  const riskItems = useMemo(
    () => [...(data?.riskItems ?? [])].sort((a, b) => (severityOrder[a.severity] ?? 3) - (severityOrder[b.severity] ?? 3)),
    [data?.riskItems],
  );

  if (isLoading) {
    return <LoadingState label="Loading security monitoring..." />;
  }

  if (isError || !data) {
    return (
      <div className="space-y-4">
        <EmptyState title="Unable to load security monitoring" description="The admin security endpoint is unavailable right now." />
        <button className="rounded-2xl border border-border px-4 py-2 text-sm font-semibold" onClick={() => refetch()} type="button">
          Retry
        </button>
      </div>
    );
  }

  const metrics = data.metrics;
  const metricCards = [
    { label: "Audit logs", value: metrics.auditLogsCount },
    { label: "Frozen groups", value: metrics.frozenGroupsCount },
    { label: "Inactive users", value: metrics.inactiveUsersCount },
    { label: "Failed receipts", value: metrics.failedReceiptsCount },
    { label: "Receipts pending review", value: metrics.pendingReviewReceiptsCount },
    { label: "Pending friend requests", value: metrics.pendingFriendRequestsCount },
    { label: "Pending verification codes", value: metrics.pendingVerificationCodesCount },
    { label: "Expired verification codes", value: metrics.expiredUnusedVerificationCodesCount },
    { label: "Push tokens", value: metrics.pushTokensCount },
  ];

  const hasNoSecurityData =
    metricCards.every((metric) => !metric.value)
    && data.recentAuditLogs.length === 0
    && riskItems.length === 0;

  if (hasNoSecurityData) {
    return <EmptyState title="No security data available yet" description="Security monitoring has no database signals to show." />;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
        {metricCards.map((metric) => (
          <div key={metric.label} className="panel p-5">
            <p className="subtle-text">{metric.label}</p>
            <p className="mt-3 text-3xl font-semibold">{metric.value == null ? "N/A" : formatCompactNumber(metric.value)}</p>
          </div>
        ))}
      </div>

      <section className="panel p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="section-title">Risk monitoring</h3>
            <p className="subtle-text">Built only from frozen groups, receipt review/OCR status, expired verification records, and inactive incomplete users.</p>
          </div>
          <p className="text-xs text-muted-foreground">Generated {formatDateTime(data.generatedAt)}</p>
        </div>
        {riskItems.length === 0 ? (
          <EmptyState title="No risk items" description="No matching database risk signals are currently present." />
        ) : (
          <div className="space-y-3">
            {riskItems.map((item) => <RiskItemRow key={`${item.type}-${item.targetType}-${item.targetId}-${item.createdAt}`} item={item} />)}
          </div>
        )}
      </section>

      <section className="panel p-5">
        <div className="mb-4">
          <h3 className="section-title">Recent audit logs</h3>
          <p className="subtle-text">Latest admin actions from the audit log table.</p>
        </div>
        {data.recentAuditLogs.length === 0 ? (
          <EmptyState title="No audit logs" description="No admin audit log rows are available yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-muted-foreground">
                <tr>
                  <th className="border-b border-border px-3 py-3 font-medium">Action</th>
                  <th className="border-b border-border px-3 py-3 font-medium">Admin</th>
                  <th className="border-b border-border px-3 py-3 font-medium">Target</th>
                  <th className="border-b border-border px-3 py-3 font-medium">Reason</th>
                  <th className="border-b border-border px-3 py-3 font-medium">Metadata</th>
                  <th className="border-b border-border px-3 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.recentAuditLogs.map((log) => (
                  <tr key={log.id} className="border-b border-border/60 last:border-0">
                    <td className="px-3 py-3 align-top font-medium">{log.action ?? "Not available"}</td>
                    <td className="px-3 py-3 align-top">{log.adminEmail ?? `Admin ${log.adminUserId ?? "N/A"}`}</td>
                    <td className="px-3 py-3 align-top">{log.targetType ?? "N/A"} {log.targetId ?? ""}</td>
                    <td className="px-3 py-3 align-top">{log.reason ?? "Not available"}</td>
                    <td className="max-w-sm px-3 py-3 align-top text-xs text-muted-foreground">{log.metadata ?? "Not available"}</td>
                    <td className="px-3 py-3 align-top">{log.createdAt ? formatDateTime(log.createdAt) : "Not available"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function RiskItemRow({ item }: { item: SecurityRiskItem }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge value={item.severity.toLowerCase()} />
            <p className="font-semibold">{item.title}</p>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{item.description ?? "No description available"}</p>
        </div>
        <div className="text-sm text-muted-foreground md:text-right">
          <p>{item.targetType ?? "Target"} {item.targetId ?? "N/A"}</p>
          <p>{item.createdAt ? formatDateTime(item.createdAt) : "Date not available"}</p>
        </div>
      </div>
    </div>
  );
}
