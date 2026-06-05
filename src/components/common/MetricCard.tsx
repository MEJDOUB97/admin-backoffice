import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MetricCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = "from-emerald-500/20 to-transparent",
}: {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  accent?: string;
}) {
  return (
    <div className={cn("metric-tile relative overflow-hidden", "before:absolute before:inset-0 before:bg-gradient-to-br before:content-['']", accent)}>
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="subtle-text">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
          <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
            <ArrowUpRight className="h-4 w-4 text-primary" />
            {hint}
          </p>
        </div>
        <div className="rounded-2xl bg-background/80 p-3 text-primary shadow-sm">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
