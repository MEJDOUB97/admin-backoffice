import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompactNumber } from "@/lib/format";

export default function ExpenseVolumeChart({ data }: { data: { date: string; totalAmount: number; expenseCount: number }[] }) {
  return (
    <div className="panel p-5">
      <div className="mb-4">
        <h3 className="section-title">Expense Volume</h3>
        <p className="subtle-text">Daily tracked MAD flowing through shared expenses.</p>
      </div>
      <div className="h-72">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
            No data available yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="volume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-emerald))" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="hsl(var(--chart-emerald))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={formatCompactNumber} />
              <Tooltip
                formatter={(value: number, name: string) => [
                  name === "totalAmount" ? formatCompactNumber(value) : value,
                  name === "totalAmount" ? "Total amount" : "Expense count",
                ]}
              />
              <Area type="monotone" dataKey="totalAmount" stroke="hsl(var(--chart-emerald))" fill="url(#volume)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
