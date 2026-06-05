import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function UserGrowthChart({ data }: { data: { month: string; users: number; active: number }[] }) {
  return (
    <div className="panel p-5">
      <div className="mb-4">
        <h3 className="section-title">User Growth</h3>
        <p className="subtle-text">New registrations and active users by month.</p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="users" fill="hsl(var(--chart-ink))" radius={[8, 8, 0, 0]} />
            <Bar dataKey="active" fill="hsl(var(--chart-sand))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
