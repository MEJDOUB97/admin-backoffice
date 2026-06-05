import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import LoadingState from "@/components/common/LoadingState";
import ReceiptPreview from "@/components/hssabna/ReceiptPreview";
import MoneyAmount from "@/components/common/MoneyAmount";
import { api } from "@/lib/api";

export default function ExpenseDetailPage() {
  const { id = "" } = useParams();
  const { data: expense, isLoading } = useQuery({ queryKey: ["expense", id], queryFn: () => api.getExpense(id) });

  if (isLoading || !expense) return <LoadingState label="Loading expense detail..." />;

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <ReceiptPreview image={expense.receiptImage} merchant={expense.merchant} confidence={expense.ocrConfidence} />
      <div className="space-y-6">
        <div className="panel p-6">
          <h1 className="text-2xl font-semibold">{expense.title}</h1>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border p-4"><p className="subtle-text">Amount</p><MoneyAmount amount={expense.amount} className="mt-2 block text-2xl font-semibold" /></div>
            <div className="rounded-2xl border border-border p-4"><p className="subtle-text">Category</p><p className="mt-2 text-2xl font-semibold">{expense.category}</p></div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            {["Flag expense", "Restore deleted expense", "Correct category", "Re-run OCR", "Re-run split calculation"].map((action) => (
              <button key={action} className="rounded-2xl border border-border px-4 py-2 text-sm">{action}</button>
            ))}
          </div>
        </div>
        <div className="panel p-6">
          <h3 className="section-title">OCR extraction result</h3>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            {expense.extractionNotes.map((note) => <div key={note} className="rounded-2xl border border-border bg-background/60 p-3">{note}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
}
