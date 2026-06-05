import { cn } from "@/lib/utils";

const tones: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  verified: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  healthy: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  watch: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  flagged: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  open: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  suspicious: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  blocked: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  frozen: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  disputed: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  edited: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  deleted: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300",
  escalated: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  resolved: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  completed: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  high: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  medium: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  low: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
};

export default function StatusBadge({ value }: { value: string }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize", tones[value] ?? "bg-muted text-muted-foreground")}>
      {value.replace(/_/g, " ")}
    </span>
  );
}
