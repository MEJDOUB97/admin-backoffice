import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const colors = [
  "hsl(var(--chart-emerald))",
  "hsl(var(--chart-sand))",
  "hsl(var(--chart-rose))",
  "hsl(var(--chart-ink))",
  "hsl(var(--chart-gold))",
  "#64748b",
];

export default function CategoryBreakdownChart({ data }: { data: { category: string; totalAmount: number; expenseCount: number }[] }) {
  return (
    <div className="panel p-5">
      <div className="mb-4">
        <h3 className="section-title">Category Breakdown</h3>
        <p className="subtle-text">Where groups spend the most in MAD.</p>
      </div>
      <div className="h-72">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
            No data available yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="totalAmount" nameKey="category" innerRadius={64} outerRadius={96} paddingAngle={4}>
                {data.map((entry, index) => (
                  <Cell key={entry.category} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
