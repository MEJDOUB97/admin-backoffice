import * as Dialog from "@radix-ui/react-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  reason: z.string().min(6, "Reason is required for this action."),
});

type FormValues = z.infer<typeof schema>;

export default function ReasonRequiredDialog({
  title,
  description,
  open,
  onOpenChange,
  onConfirm,
}: {
  title: string;
  description: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { reason: "" },
  });

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-950/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border bg-card p-6 shadow-panel">
          <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-muted-foreground">{description}</Dialog.Description>
          <form
            className="mt-5 space-y-4"
            onSubmit={form.handleSubmit((values) => {
              onConfirm(values.reason);
              form.reset();
              onOpenChange(false);
            })}
          >
            <div>
              <label className="mb-2 block text-sm font-medium">Reason</label>
              <textarea
                rows={4}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm"
                placeholder="Explain why this admin action is needed..."
                {...form.register("reason")}
              />
              <p className="mt-1 text-xs text-rose-500">{form.formState.errors.reason?.message}</p>
            </div>
            <div className="flex justify-end gap-3">
              <Dialog.Close className="rounded-2xl border border-border px-4 py-2 text-sm">Cancel</Dialog.Close>
              <button className="rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground" type="submit">
                Continue with reason
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
