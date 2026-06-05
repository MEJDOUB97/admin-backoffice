import { AlertTriangle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RiskBadge({ score }: { score: number }) {
  const high = score >= 70;
  const medium = score >= 30 && score < 70;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        high && "bg-rose-500/15 text-rose-700 dark:text-rose-300",
        medium && "bg-amber-500/15 text-amber-700 dark:text-amber-300",
        !high && !medium && "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
      )}
    >
      {high || medium ? <AlertTriangle className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
      Risk {score}
    </span>
  );
}
