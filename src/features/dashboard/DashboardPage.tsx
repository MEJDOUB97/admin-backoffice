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
  const { data, isError, isLoading, refetch } = useQuery({ queryKey: ["dashboard"], queryFn: api.getDashboard });

  if (isError) {
    return (
      <div className="panel flex min-h-56 flex-col items-center justify-center gap-4 p-8 text-center">
        <div>
          <h3 className="text-lg font-semibold">Unable to load dashboard</h3>
          <p className="subtle-text">The admin dashboard API is unavailable. Check that the backend is running, then retry.</p>
        </div>
        <button className="rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" onClick={() => refetch()}>
          Retry
        </button>
      </div>
    );
  }

  if (isLoading || !data) {
    return <LoadingState label="Loading Hssabna overview..." />;
  }

  const metrics = data.metrics;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total users" value={formatCompactNumber(metrics.totalUsers)} hint="Steady weekly growth" icon={Users} />
        <MetricCard label="Active users" value={formatCompactNumber(metrics.activeUsers)} hint="Accounts currently marked active" icon={UsersRound} accent="from-amber-500/20 to-transparent" />
        <MetricCard label="Total groups" value={formatCompactNumber(metrics.totalGroups)} hint="Trip and roommates lead" icon={Wallet} accent="from-sky-500/20 to-transparent" />
        <MetricCard label="Total expenses" value={formatCompactNumber(metrics.totalExpenses)} hint="Receipt scans outperform manual entries" icon={Receipt} accent="from-rose-500/20 to-transparent" />
        <MetricCard label="Tracked MAD volume" value={formatMoney(metrics.totalExpenseAmount)} hint="Total recorded expense amount" icon={CircleDollarSign} />
        <MetricCard label="Pending friend requests" value={String(metrics.pendingFriendRequests)} hint="Requests waiting for action" icon={RefreshCcw} accent="from-amber-500/20 to-transparent" />
        <MetricCard label="Recent users" value={String(metrics.recentUsersCount)} hint="Latest accounts returned by API" icon={AlertTriangle} accent="from-orange-500/20 to-transparent" />
        <MetricCard label="Recent groups" value={String(metrics.recentGroupsCount)} hint="Latest groups returned by API" icon={ShieldAlert} accent="from-rose-500/20 to-transparent" />
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
