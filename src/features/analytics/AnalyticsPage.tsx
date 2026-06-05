import { useQuery } from "@tanstack/react-query";
import CategoryBreakdownChart from "@/components/charts/CategoryBreakdownChart";
import ExpenseVolumeChart from "@/components/charts/ExpenseVolumeChart";
import UserGrowthChart from "@/components/charts/UserGrowthChart";
import { api } from "@/lib/api";

export default function AnalyticsPage() {
  const { data } = useQuery({ queryKey: ["dashboard"], queryFn: api.getDashboard });

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <ExpenseVolumeChart data={data.expenseVolume} />
        <UserGrowthChart data={data.userGrowth} />
      </div>
      <CategoryBreakdownChart data={data.categoryBreakdown} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          "Casablanca vs Rabat vs Marrakech spending patterns",
          "Unsettled balance heatmap",
          "Best time to send reminders",
          "App version adoption",
        ].map((card) => <div key={card} className="panel p-5 text-sm">{card}</div>)}
      </div>
    </div>
  );
}
