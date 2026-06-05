export default function SettlementGraph({
  nodes,
}: {
  nodes: { from: string; to: string; amount: string }[];
}) {
  return (
    <div className="panel p-5">
      <h3 className="section-title">Who Owes Whom</h3>
      <div className="mt-4 space-y-3">
        {nodes.map((node) => (
          <div key={`${node.from}-${node.to}`} className="flex items-center justify-between rounded-2xl border border-border bg-background/60 p-3 text-sm">
            <span>{node.from}</span>
            <span className="text-muted-foreground">pays</span>
            <span>{node.to}</span>
            <span className="rounded-full bg-primary/10 px-2 py-1 font-semibold text-primary">{node.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
