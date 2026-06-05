import * as Dialog from "@radix-ui/react-dialog";

export default function ConfirmActionDialog({
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
  onConfirm: () => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-950/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border bg-card p-6 shadow-panel">
          <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-muted-foreground">{description}</Dialog.Description>
          <div className="mt-6 flex justify-end gap-3">
            <Dialog.Close className="rounded-2xl border border-border px-4 py-2 text-sm">Cancel</Dialog.Close>
            <button
              className="rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
            >
              Confirm
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
