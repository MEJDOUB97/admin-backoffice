import { Inbox } from "lucide-react";

export default function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="panel flex min-h-56 flex-col items-center justify-center gap-3 p-8 text-center">
      <div className="rounded-2xl bg-muted p-3">
        <Inbox className="h-6 w-6 text-muted-foreground" />
      </div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="subtle-text">{description}</p>
      </div>
    </div>
  );
}
