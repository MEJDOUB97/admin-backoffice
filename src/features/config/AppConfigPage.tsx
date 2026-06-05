import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import ReasonRequiredDialog from "@/components/common/ReasonRequiredDialog";
import RemoteConfigEditor from "@/components/hssabna/RemoteConfigEditor";
import { api } from "@/lib/api";

export default function AppConfigPage() {
  const { data } = useQuery({ queryKey: ["config"], queryFn: api.getRemoteConfig });
  const [changeRequest, setChangeRequest] = useState<string | null>(null);

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {["Receipt scanning", "Smart reminders", "Darija reminders", "Offline expense draft"].map((flag) => (
          <div key={flag} className="panel p-5 text-sm">{flag}</div>
        ))}
      </div>
      <RemoteConfigEditor values={data} onRequestChange={setChangeRequest} />
      <ReasonRequiredDialog
        title="Change remote config"
        description="Configuration changes must be justified before rollout."
        open={Boolean(changeRequest)}
        onOpenChange={(open) => !open && setChangeRequest(null)}
        onConfirm={(reason) => toast.success(changeRequest ?? "Config change requested", { description: reason })}
      />
    </div>
  );
}
