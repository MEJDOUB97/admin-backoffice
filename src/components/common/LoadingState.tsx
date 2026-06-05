export default function LoadingState({ label = "Loading dashboard data..." }: { label?: string }) {
  return (
    <div className="panel flex min-h-52 items-center justify-center p-8">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        {label}
      </div>
    </div>
  );
}
