export default function AwkwardnessRiskCard({ risk }: { risk: number | null }) {
  if (risk == null) {
    return (
      <div className="panel p-5 opacity-80">
        <p className="subtle-text">Awkwardness Risk</p>
        <p className="mt-4 text-2xl font-semibold">Not available yet</p>
        <p className="mt-2 text-sm text-muted-foreground">Expense shares do not currently expose paid status or aging rules for a real risk score.</p>
      </div>
    );
  }

  return (
    <div className="panel bg-gradient-to-br from-rose-500/10 via-card to-card p-5">
      <p className="subtle-text">Awkwardness Risk</p>
      <p className="mt-4 text-4xl font-semibold">{risk}%</p>
      <p className="mt-2 text-sm text-muted-foreground">Calculated from backend risk rules.</p>
      <div className="mt-4 h-2 rounded-full bg-muted">
        <div className="h-2 rounded-full bg-accent" style={{ width: `${risk}%` }} />
      </div>
    </div>
  );
}
