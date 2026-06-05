import { useQuery } from "@tanstack/react-query";
import ReceiptPreview from "@/components/hssabna/ReceiptPreview";
import { api } from "@/lib/api";

export default function ReceiptCenterPage() {
  const { data = [] } = useQuery({ queryKey: ["expenses"], queryFn: api.getExpenses });
  const scanned = data.filter((expense) => expense.source === "receipt_scan");

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          "Receipt Weirdness Detector",
          "Duplicate receipt warning",
          "Blurry image warning",
          "Impossible total warning",
        ].map((item) => <div key={item} className="panel p-5 text-sm">{item}</div>)}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {scanned.map((expense) => (
          <ReceiptPreview key={expense.id} image={expense.receiptImage} merchant={expense.merchant} confidence={expense.ocrConfidence} />
        ))}
      </div>
    </div>
  );
}
