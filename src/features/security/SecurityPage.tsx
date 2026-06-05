import { useQuery } from "@tanstack/react-query";
import PermissionGate from "@/components/common/PermissionGate";
import { api } from "@/lib/api";

export default function SecurityPage() {
  const { data = [] } = useQuery({ queryKey: ["security"], queryFn: api.getSecurity });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {data.map((item) => (
          <div key={item.title} className="panel p-5">
            <p className="subtle-text">{item.title}</p>
            <p className="mt-3 text-3xl font-semibold">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="panel p-5">
        <div className="flex flex-wrap gap-3">
          <PermissionGate permission="users.block"><button className="rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground">Block user</button></PermissionGate>
          <PermissionGate permission="security.write"><button className="rounded-2xl border border-border px-4 py-2 text-sm">Require re-verification</button></PermissionGate>
          <PermissionGate permission="groups.write"><button className="rounded-2xl border border-border px-4 py-2 text-sm">Freeze group</button></PermissionGate>
          <PermissionGate permission="security.write"><button className="rounded-2xl border border-border px-4 py-2 text-sm">Disable settlement</button></PermissionGate>
        </div>
      </div>
    </div>
  );
}
