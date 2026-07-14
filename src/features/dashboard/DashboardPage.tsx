import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, CircleDollarSign, Receipt, RefreshCcw, ShieldAlert, Users, UsersRound, Wallet } from "lucide-react";
import MetricCard from "@/components/common/MetricCard";
import LoadingState from "@/components/common/LoadingState";
import ExpenseVolumeChart from "@/components/charts/ExpenseVolumeChart";
import UserGrowthChart from "@/components/charts/UserGrowthChart";
import FriendshipHealthScore from "@/components/hssabna/FriendshipHealthScore";
import { api } from "@/lib/api";
import { formatCompactNumber, formatMoney } from "@/lib/format";

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
        <MetricCard label="Total users" value={formatCompactNumber(metrics.totalUsers)} hint="All user records in the database" icon={Users} />
        <MetricCard label="Active users" value={formatCompactNumber(metrics.activeUsers)} hint="Accounts currently marked active" icon={UsersRound} accent="from-amber-500/20 to-transparent" />
        <MetricCard label="Total groups" value={formatCompactNumber(metrics.totalGroups)} hint="All event/group records" icon={Wallet} accent="from-sky-500/20 to-transparent" />
        <MetricCard label="Total expenses" value={formatCompactNumber(metrics.totalExpenses)} hint="All expense records" icon={Receipt} accent="from-rose-500/20 to-transparent" />
        <MetricCard label="Tracked MAD volume" value={formatMoney(metrics.totalExpenseAmount)} hint="Total recorded expense amount" icon={CircleDollarSign} />
        <MetricCard label="Pending friend requests" value={String(metrics.pendingFriendRequests)} hint="Requests waiting for action" icon={RefreshCcw} accent="from-amber-500/20 to-transparent" />
        <MetricCard label="Recent users" value={String(metrics.recentUsersCount)} hint="Latest accounts returned by API" icon={AlertTriangle} accent="from-orange-500/20 to-transparent" />
        <MetricCard label="Recent groups" value={String(metrics.recentGroupsCount)} hint="Latest groups returned by API" icon={ShieldAlert} accent="from-rose-500/20 to-transparent" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ExpenseVolumeChart data={data.expenseVolume} />
        <div className="grid gap-6">
          {metrics.friendshipHealthScore != null && <FriendshipHealthScore score={metrics.friendshipHealthScore} />}
          {metrics.friendshipHealthScore == null && (
            <div className="panel p-5">
              <p className="subtle-text">Friendship Health Score</p>
              <p className="mt-4 text-2xl font-semibold">No friend request history yet</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6">
        <UserGrowthChart data={data.userGrowth} />
      </div>
    </div>
  );
}
