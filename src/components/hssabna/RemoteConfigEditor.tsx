import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function RemoteConfigEditor({
  values,
  onRequestChange,
}: {
  values: Record<string, string | number | boolean>;
  onRequestChange: (message: string) => void;
}) {
  const form = useForm({ defaultValues: values });

  useEffect(() => {
    form.reset(values);
  }, [form, values]);

  return (
    <div className="panel p-5">
      <div className="mb-4">
        <h3 className="section-title">Remote Config</h3>
        <p className="subtle-text">Editable release controls for Morocco-first rollout logic.</p>
      </div>
      <form
        className="grid gap-4 md:grid-cols-2"
        onSubmit={form.handleSubmit((data) => onRequestChange(`Remote config update requested for minimum version ${data.minimumAppVersion}`))}
      >
        {Object.entries(values).map(([key, value]) => (
          <label key={key} className="block">
            <span className="mb-2 block text-sm font-medium capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
            {typeof value === "boolean" ? (
              <select className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm" {...form.register(key)}>
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            ) : (
              <input className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm" {...form.register(key)} />
            )}
          </label>
        ))}
        <div className="md:col-span-2">
          <button className="rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" type="submit">
            Propose config change
          </button>
        </div>
      </form>
    </div>
  );
}
