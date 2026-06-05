import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompactNumber } from "@/lib/format";

export default function ExpenseVolumeChart({ data }: { data: { month: string; amount: number }[] }) {
  return (
    <div className="panel p-5">
      <div className="mb-4">
        <h3 className="section-title">Expense Volume</h3>
        <p className="subtle-text">Tracked MAD flowing through shared expenses.</p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="volume" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-emerald))" stopOpacity={0.7} />
                <stop offset="95%" stopColor="hsl(var(--chart-emerald))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatCompactNumber} />
            <Tooltip formatter={(value: number) => formatCompactNumber(value)} />
            <Area type="monotone" dataKey="amount" stroke="hsl(var(--chart-emerald))" fill="url(#volume)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
