import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import EmptyState from "@/components/common/EmptyState";
import LoadingState from "@/components/common/LoadingState";
import { api } from "@/lib/api";
import type { ConfigCategory, ConfigSetting } from "@/types/config";

const CATEGORY_ORDER: ConfigCategory[] = ["GENERAL", "AUTH", "SUPPORT", "RECEIPTS", "UPLOADS"];

const CATEGORY_LABELS: Record<ConfigCategory, string> = {
  GENERAL: "General",
  AUTH: "Authentication",
  SUPPORT: "Support",
  RECEIPTS: "Receipts",
  UPLOADS: "Uploads",
};

function formatSettingLabel(key: string) {
  return key
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function AppConfigPage() {
  const queryClient = useQueryClient();
  const [draftValues, setDraftValues] = useState<Record<string, string>>({});

  const configQuery = useQuery({
    queryKey: ["admin-config"],
    queryFn: api.getAdminConfig,
  });

  const updateMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) => api.updateAdminConfig(key, value),
    onSuccess: (updatedSetting) => {
      queryClient.setQueryData(["admin-config"], (current: Awaited<ReturnType<typeof api.getAdminConfig>> | undefined) => {
        if (!current) {
          return current;
        }
        return {
          items: current.items.map((setting) => (setting.key === updatedSetting.key ? updatedSetting : setting)),
        };
      });
      setDraftValues((current) => ({ ...current, [updatedSetting.key]: updatedSetting.value }));
      toast.success(`${formatSettingLabel(updatedSetting.key)} saved`);
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Config update failed";
      toast.error(message);
    },
  });

  const settings = configQuery.data?.items ?? [];

  useEffect(() => {
    if (!configQuery.data) {
      return;
    }

    setDraftValues((current) => {
      const next = { ...current };
      for (const setting of configQuery.data.items) {
        next[setting.key] = setting.value;
      }
      return next;
    });
  }, [configQuery.data]);

  const groupedSettings = useMemo(() => {
    return CATEGORY_ORDER.map((category) => ({
      category,
      settings: settings.filter((setting) => setting.category === category),
    })).filter((group) => group.settings.length > 0);
  }, [settings]);

  if (configQuery.isLoading) {
    return <LoadingState label="Loading app configuration..." />;
  }

  if (configQuery.isError) {
    return (
      <div className="space-y-4">
        <EmptyState title="Config unavailable" description="The admin configuration API could not be reached." />
        <button
          className="rounded-2xl border border-border px-4 py-2 text-sm font-semibold"
          type="button"
          onClick={() => configQuery.refetch()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (settings.length === 0) {
    return <EmptyState title="No settings found" description="No editable admin settings are available yet." />;
  }

  return (
    <div className="space-y-6">
      <div className="panel p-5">
        <h2 className="section-title">App Settings</h2>
        <p className="subtle-text">
          Safe non-secret settings only. Credentials, API keys, filesystem paths, and internal secrets are not exposed here.
        </p>
      </div>

      {groupedSettings.map(({ category, settings: categorySettings }) => (
        <section key={category} className="panel p-5">
          <div className="mb-5">
            <h3 className="section-title">{CATEGORY_LABELS[category]}</h3>
            <p className="subtle-text">{categorySettings.length} setting{categorySettings.length === 1 ? "" : "s"}</p>
          </div>

          <div className="space-y-4">
            {categorySettings.map((setting) => (
              <SettingRow
                key={setting.key}
                setting={setting}
                value={draftValues[setting.key] ?? setting.value}
                isSaving={updateMutation.isPending && updateMutation.variables?.key === setting.key}
                onChange={(value) => setDraftValues((current) => ({ ...current, [setting.key]: value }))}
                onSave={() => updateMutation.mutate({ key: setting.key, value: draftValues[setting.key] ?? setting.value })}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function SettingRow({
  setting,
  value,
  isSaving,
  onChange,
  onSave,
}: {
  setting: ConfigSetting;
  value: string;
  isSaving: boolean;
  onChange: (value: string) => void;
  onSave: () => void;
}) {
  const isChanged = value !== setting.value;
  const canSave = setting.editable && isChanged && !isSaving;

  return (
    <div className="rounded-2xl border border-border p-4">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(240px,360px)_auto] lg:items-start">
        <div>
          <div className="text-sm font-semibold">{formatSettingLabel(setting.key)}</div>
          <div className="mt-1 font-mono text-xs text-muted-foreground">{setting.key}</div>
          {setting.description ? <p className="mt-2 subtle-text">{setting.description}</p> : null}
        </div>

        {setting.valueType === "BOOLEAN" ? (
          <select
            className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
            disabled={!setting.editable || isSaving}
            value={value}
            onChange={(event) => onChange(event.target.value)}
          >
            <option value="true">Enabled</option>
            <option value="false">Disabled</option>
          </select>
        ) : setting.valueType === "NUMBER" ? (
          <input
            className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
            disabled={!setting.editable || isSaving}
            min="1"
            type="number"
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
        ) : setting.key === "SUPPORT_POLICY_TEXT" ? (
          <textarea
            className="min-h-24 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
            disabled={!setting.editable || isSaving}
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
        ) : (
          <input
            className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
            disabled={!setting.editable || isSaving}
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
        )}

        <button
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
          disabled={!canSave}
          type="button"
          onClick={onSave}
          title={setting.editable ? undefined : "This setting is read-only"}
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
