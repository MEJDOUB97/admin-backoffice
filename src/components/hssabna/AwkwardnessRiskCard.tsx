export default function AwkwardnessRiskCard({ risk }: { risk: number }) {
  return (
    <div className="panel bg-gradient-to-br from-rose-500/10 via-card to-card p-5">
      <p className="subtle-text">Awkwardness Risk</p>
      <p className="mt-4 text-4xl font-semibold">{risk}%</p>
      <p className="mt-2 text-sm text-muted-foreground">Driven by old balances, ignored nudges, and disputed receipts.</p>
      <div className="mt-4 h-2 rounded-full bg-muted">
        <div className="h-2 rounded-full bg-accent" style={{ width: `${risk}%` }} />
      </div>
    </div>
  );
}
