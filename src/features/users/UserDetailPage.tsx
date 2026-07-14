import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import EmptyState from "@/components/common/EmptyState";
import LoadingState from "@/components/common/LoadingState";
import MoneyAmount from "@/components/common/MoneyAmount";
import StatusBadge from "@/components/common/StatusBadge";
import { api } from "@/lib/api";
import { formatDateTime } from "@/lib/format";

export default function UserDetailPage() {
  const { id = "" } = useParams();
  const { data: user, isLoading: isUserLoading, isError: isUserError } = useQuery({
    queryKey: ["user", id],
    queryFn: () => api.getUserById(id),
  });

  if (isUserLoading) {
    return <LoadingState label="Loading user profile..." />;
  }

  if (isUserError) {
    return <EmptyState title="Unable to load user" description="The selected user profile could not be loaded right now." />;
  }

  if (!user) {
    return <EmptyState title="User not found" description="The selected user does not exist in the current admin dataset." />;
  }

  const relatedGroups = user.groups ?? [];

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="space-y-6">
        <div className="panel p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-xl font-semibold text-primary">{user.avatar}</div>
            <div>
              <h1 className="text-2xl font-semibold">{user.name}</h1>
              {user.username ? <p className="subtle-text">@{user.username}</p> : null}
              <p className="subtle-text">{user.email}</p>
              <p className="subtle-text">{user.phone}</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <StatusBadge value={user.status} />
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-border p-4">
              <p className="subtle-text">Total paid by user</p>
              <MoneyAmount amount={user.totalPaid} className="mt-2 block text-2xl font-semibold" />
            </div>
            <div className="rounded-2xl border border-border p-4">
              <p className="subtle-text">Groups</p>
              <p className="mt-2 text-2xl font-semibold">{user.groupsCount ?? relatedGroups.length}</p>
            </div>
            <div className="rounded-2xl border border-border p-4">
              <p className="subtle-text">Expenses paid</p>
              <p className="mt-2 text-2xl font-semibold">{user.expensesCount ?? 0}</p>
            </div>
            <div className="rounded-2xl border border-border p-4">
              <p className="subtle-text">Friends</p>
              <p className="mt-2 text-2xl font-semibold">{user.friendsCount ?? 0}</p>
            </div>
          </div>
        </div>

        <div className="panel p-6">
          <h3 className="section-title">Account details</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <DetailItem label="Role" value={user.role ?? "USER"} />
            <DetailItem label="Currency" value={user.currencyCode ?? "Not set"} />
            <DetailItem label="City" value={user.city} />
            <DetailItem label="User ID" value={user.id} />
            <DetailItem label="Email" value={user.email} />
            <DetailItem label="Joined" value={formatDateTime(user.joinedAt)} />
            <DetailItem label="Onboarding" value={user.onboardingCompleted ? "Completed" : "Incomplete"} />
            <DetailItem label="Onboarding step" value={user.onboardingStep != null ? String(user.onboardingStep) : "Not available"} />
            <DetailItem label="Groups count" value={String(user.groupsCount ?? relatedGroups.length)} />
            <DetailItem label="Expenses paid" value={String(user.expensesCount ?? 0)} />
            <DetailItem label="Friends count" value={String(user.friendsCount ?? 0)} />
          </div>
        </div>

        <div className="panel p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="section-title">Admin actions</h3>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">Coming later</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {["Force logout", "Reset verification", "Mark trusted", "Export user data", "Block user", "Anonymize user"].map((action) => (
              <button
                key={action}
                className="rounded-2xl border border-border px-4 py-2 text-sm text-muted-foreground opacity-60"
                disabled
                title="Requires backend audit-safe endpoint"
                type="button"
              >
                {action}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Admin actions are disabled until audit-safe backend endpoints are implemented.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="panel p-6">
          <h3 className="section-title">Groups</h3>
          <div className="mt-4">
            {relatedGroups.length === 0 ? (
              <EmptyState title="No groups found for this user." description="This user is not currently a member of any tracked group." />
            ) : (
              <div className="space-y-3">
                {relatedGroups.map((group) => (
                  <Link
                    key={group.id}
                    to={`/admin/groups/${group.id}`}
                    className="flex items-center justify-between rounded-2xl border border-border bg-background/60 px-4 py-3 transition hover:border-primary/40 hover:bg-background"
                  >
                    <span>
                      <span className="block font-medium text-primary">{group.name}</span>
                      <span className="subtle-text text-xs">
                        {group.membersCount ?? group.memberIds.length} members - {group.expensesCount ?? 0} expenses - <MoneyAmount amount={group.totalVolume} />
                      </span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-primary" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="panel p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="section-title">Audit timeline</h3>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">Coming later</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Audit history is not available yet.</p>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background/60 p-3 text-sm">
      <p className="subtle-text">{label}</p>
      <p className="mt-1 font-medium">{value || "Not available"}</p>
    </div>
  );
}
