export default function FriendshipHealthScore({ score }: { score: number }) {
  return (
    <div className="panel bg-gradient-to-br from-emerald-500/10 via-card to-card p-5">
      <p className="subtle-text">Friendship Health Score</p>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-4xl font-semibold">{score}/100</p>
          <p className="mt-2 text-sm text-muted-foreground">Healthy sharing rhythm with low dispute pressure.</p>
        </div>
        <div className="h-24 w-24 rounded-full border-[10px] border-emerald-500/30 border-t-emerald-500" />
      </div>
    </div>
  );
}
