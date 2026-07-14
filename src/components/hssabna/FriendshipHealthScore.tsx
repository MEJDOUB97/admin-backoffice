export default function FriendshipHealthScore({ score }: { score: number | null }) {
  if (score == null) {
    return (
      <div className="panel p-5 opacity-80">
        <p className="subtle-text">Friendship Health Score</p>
        <p className="mt-4 text-2xl font-semibold">Not available yet</p>
        <p className="mt-2 text-sm text-muted-foreground">No friend request history is available for a real score.</p>
      </div>
    );
  }

  return (
    <div className="panel bg-gradient-to-br from-emerald-500/10 via-card to-card p-5">
      <p className="subtle-text">Friendship Health Score</p>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-4xl font-semibold">{Math.round(score)}/100</p>
          <p className="mt-2 text-sm text-muted-foreground">Accepted friend requests divided by all friend requests.</p>
        </div>
        <div className="h-24 w-24 rounded-full border-[10px] border-emerald-500/30 border-t-emerald-500" />
      </div>
    </div>
  );
}
