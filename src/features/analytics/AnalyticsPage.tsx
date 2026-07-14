import { useQuery } from "@tanstack/react-query";
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
    </div>
  );
}
