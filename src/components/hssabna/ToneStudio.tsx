export default function ToneStudio({ templates }: { templates: { name: string; tone: string }[] }) {
  return (
    <div className="panel p-5">
      <h3 className="section-title">Tone Studio</h3>
      <div className="mt-4 grid gap-3">
        {templates.map((template) => (
          <div key={template.name} className="rounded-2xl border border-border bg-background/60 p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium">{template.name}</p>
              <span className="rounded-full bg-secondary px-2 py-1 text-xs">{template.name === "Darija" ? "MA local" : "Template"}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{template.tone}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
