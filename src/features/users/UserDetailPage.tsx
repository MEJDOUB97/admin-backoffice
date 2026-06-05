import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import EmptyState from "@/components/common/EmptyState";
import LoadingState from "@/components/common/LoadingState";
import MoneyAmount from "@/components/common/MoneyAmount";
import PermissionGate from "@/components/common/PermissionGate";
import RiskBadge from "@/components/common/RiskBadge";
import StatusBadge from "@/components/common/StatusBadge";
import { api } from "@/lib/api";

export default function UserDetailPage() {
  const { id = "" } = useParams();
  const { data: user, isLoading: isUserLoading, isError: isUserError } = useQuery({
    queryKey: ["user", id],
    queryFn: () => api.getUserById(id),
  });
  const { data: relatedGroups = [], isLoading: areGroupsLoading, isError: areGroupsError } = useQuery({
    queryKey: ["user-groups", id],
    queryFn: () => api.getGroupsByUserId(id),
    enabled: Boolean(id),
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

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="space-y-6">
        <div className="panel p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-xl font-semibold text-primary">{user.avatar}</div>
            <div>
              <h1 className="text-2xl font-semibold">{user.name}</h1>
              <p className="subtle-text">{user.city} - {user.device}</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <StatusBadge value={user.status} />
            <RiskBadge score={user.riskScore} />
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border p-4">
              <p className="subtle-text">Total paid</p>
              <MoneyAmount amount={user.totalPaid} className="mt-2 block text-2xl font-semibold" />
            </div>
            <div className="rounded-2xl border border-border p-4">
              <p className="subtle-text">Total owed</p>
              <MoneyAmount amount={user.totalOwed} className="mt-2 block text-2xl font-semibold" />
            </div>
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
            {user.notes.map((note) => (
              <div key={note} className="rounded-2xl border border-border bg-background/60 p-3 text-sm">
                {note}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="panel p-6">
          <h3 className="section-title">Groups</h3>
          <div className="mt-4">
            {areGroupsLoading ? (
              <LoadingState label="Loading user groups..." />
            ) : areGroupsError ? (
              <EmptyState title="Unable to load groups" description="User group membership could not be loaded right now." />
            ) : relatedGroups.length === 0 ? (
              <EmptyState title="No groups found for this user." description="This user is not currently a member of any tracked group." />
            ) : (
              <div className="space-y-3">
                {relatedGroups.map((group) => (
                  <Link
                    key={group.id}
                    to={`/admin/groups/${group.id}`}
                    className="flex items-center justify-between rounded-2xl border border-border bg-background/60 px-4 py-3 transition hover:border-primary/40 hover:bg-background"
                  >
                    <span className="font-medium text-primary">{group.name}</span>
                    <ArrowUpRight className="h-4 w-4 text-primary" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="panel p-6">
          <h3 className="section-title">Audit timeline</h3>
          <div className="mt-4 space-y-4">
            {["Verification reset requested by support", "Joined Agadir Surf Trip", "Shared first receipt scan"].map((event) => (
              <div key={event} className="border-s-2 border-primary/40 ps-4 text-sm text-muted-foreground">
                {event}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
