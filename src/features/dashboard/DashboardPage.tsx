import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, CircleDollarSign, Receipt, RefreshCcw, ShieldAlert, Users, UsersRound, Wallet } from "lucide-react";
import MetricCard from "@/components/common/MetricCard";
import LoadingState from "@/components/common/LoadingState";
import CategoryBreakdownChart from "@/components/charts/CategoryBreakdownChart";
import ExpenseVolumeChart from "@/components/charts/ExpenseVolumeChart";
import UserGrowthChart from "@/components/charts/UserGrowthChart";
import AwkwardnessRiskCard from "@/components/hssabna/AwkwardnessRiskCard";
import FriendshipHealthScore from "@/components/hssabna/FriendshipHealthScore";
import { api } from "@/lib/api";
import { formatCompactNumber, formatMoney, formatPercent } from "@/lib/format";

export default function DashboardPage() {
  const { data, isLoading } = useQuery({ queryKey: ["dashboard"], queryFn: api.getDashboard });

  if (isLoading || !data) {
    return <LoadingState label="Loading Hssabna overview..." />;
  }

  const metrics = data.metrics;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total users" value={formatCompactNumber(metrics.totalUsers)} hint="Steady weekly growth" icon={Users} />
        <MetricCard label="Active users today" value={formatCompactNumber(metrics.activeUsersToday)} hint="Morning usage spike in Casablanca" icon={UsersRound} accent="from-amber-500/20 to-transparent" />
        <MetricCard label="Total groups" value={formatCompactNumber(metrics.totalGroups)} hint="Trip and roommates lead" icon={Wallet} accent="from-sky-500/20 to-transparent" />
        <MetricCard label="Total expenses" value={formatCompactNumber(metrics.totalExpenses)} hint="Receipt scans outperform manual entries" icon={Receipt} accent="from-rose-500/20 to-transparent" />
        <MetricCard label="Tracked MAD volume" value={formatMoney(metrics.totalMadVolume)} hint="Healthy volume this month" icon={CircleDollarSign} />
        <MetricCard label="Pending settlements" value={String(metrics.pendingSettlements)} hint="Focus on rent and travel groups" icon={RefreshCcw} accent="from-amber-500/20 to-transparent" />
        <MetricCard label="Open support tickets" value={String(metrics.openSupportTickets)} hint="Money tension detector active" icon={AlertTriangle} accent="from-orange-500/20 to-transparent" />
        <MetricCard label="Suspicious activity" value={String(metrics.suspiciousActivity)} hint="Device-sharing watchlist updated" icon={ShieldAlert} accent="from-rose-500/20 to-transparent" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ExpenseVolumeChart data={data.expenseVolume} />
        <div className="grid gap-6">
          <FriendshipHealthScore score={metrics.friendshipHealth} />
          <AwkwardnessRiskCard risk={metrics.awkwardnessRisk} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <UserGrowthChart data={data.userGrowth} />
        <CategoryBreakdownChart data={data.categoryBreakdown} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="panel p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="section-title">Top Spending Moments</h3>
              <p className="subtle-text">When shared spending peaks across Morocco-focused user groups.</p>
            </div>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs">Reminder conversion {formatPercent(metrics.reminderConversionRate)}</span>
          </div>
          <div className="space-y-4">
            {data.topSpendingMoments.map((moment) => (
              <div key={moment.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>{moment.label}</span>
                  <span>{moment.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${moment.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="panel p-5">
          <h3 className="section-title">Split-Expense Signals</h3>
          <div className="mt-4 space-y-4">
            <div className="rounded-2xl border border-border bg-background/60 p-4">
              <p className="subtle-text">Settlement Velocity</p>
              <p className="mt-2 text-3xl font-semibold">{metrics.settlementVelocity}%</p>
            </div>
            <div className="rounded-2xl border border-border bg-background/60 p-4">
              <p className="subtle-text">Receipt Scan Confidence</p>
              <p className="mt-2 text-3xl font-semibold">{metrics.receiptScanConfidence}%</p>
            </div>
            <div className="rounded-2xl border border-border bg-background/60 p-4">
              <p className="subtle-text">Reminder Conversion Rate</p>
              <p className="mt-2 text-3xl font-semibold">{metrics.reminderConversionRate}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
