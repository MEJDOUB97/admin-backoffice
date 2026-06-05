import { useQuery } from "@tanstack/react-query";
import ToneStudio from "@/components/hssabna/ToneStudio";
import { api } from "@/lib/api";

export default function RemindersPage() {
  const { data = [] } = useQuery({ queryKey: ["reminders"], queryFn: api.getReminders });

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="panel p-6">
        <h3 className="section-title">Reminder campaigns</h3>
        <div className="mt-4 space-y-3">
          {[
            "Friendly push for balances older than 3 days",
            "Funny SMS for ignored nudges after 2 opens",
            "Darija reactivation for rent groups in Casablanca",
            "WhatsApp placeholder flow for future channel testing",
          ].map((item) => <div key={item} className="rounded-2xl border border-border bg-background/60 p-4 text-sm">{item}</div>)}
        </div>
      </div>
      <ToneStudio templates={data} />
    </div>
  );
}
