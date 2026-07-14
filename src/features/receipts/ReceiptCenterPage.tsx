import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import EmptyState from "@/components/common/EmptyState";
import LoadingState from "@/components/common/LoadingState";
import MoneyAmount from "@/components/common/MoneyAmount";
import StatusBadge from "@/components/common/StatusBadge";
import DataTable from "@/components/tables/DataTable";
import { formatDateTime } from "@/lib/format";
import { api } from "@/lib/api";
import type { Receipt } from "@/types/receipt";

export default function ReceiptCenterPage() {
  const [search, setSearch] = useState("");
  const [ocrStatus, setOcrStatus] = useState("");
  const [reviewStatus, setReviewStatus] = useState("");
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const { data = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["receipts", search, ocrStatus, reviewStatus],
    queryFn: () => api.getReceipts({ search, ocrStatus, reviewStatus }),
  });

  if (isLoading) {
    return <LoadingState label="Loading receipts..." />;
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <EmptyState title="Unable to load receipts" description="Receipt/OCR records could not be loaded from the backend right now." />
        <button
          className="rounded-2xl border border-border px-4 py-2 text-sm font-semibold"
          onClick={() => refetch()}
          type="button"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="panel p-5 text-sm">OCR records are read-only in this first admin version.</div>
        <div className="panel p-5 text-sm">Re-run OCR requires a real OCR engine endpoint.</div>
        <div className="panel p-5 text-sm">Approve/reject requires an audited review workflow.</div>
        <div className="panel p-5 text-sm">File preview requires a secure receipt download URL.</div>
      </div>

      <div className="panel p-5 text-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid flex-1 gap-3 md:grid-cols-2">
            <select
              className="rounded-2xl border border-border bg-background px-4 py-2.5 text-sm"
              onChange={(event) => setOcrStatus(event.target.value)}
              value={ocrStatus}
            >
              <option value="">All OCR statuses</option>
              <option value="NOT_PROCESSED">Not processed</option>
              <option value="PROCESSING">Processing</option>
              <option value="PROCESSED">Processed</option>
              <option value="FAILED">Failed</option>
            </select>
            <select
              className="rounded-2xl border border-border bg-background px-4 py-2.5 text-sm"
              onChange={(event) => setReviewStatus(event.target.value)}
              value={reviewStatus}
            >
              <option value="">All review statuses</option>
              <option value="PENDING">Pending</option>
              <option value="REVIEWED">Reviewed</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-2xl border border-border px-4 py-2 text-sm" onClick={() => exportReceiptsCsv(data)} type="button">
              Export CSV
            </button>
            <button
              className="cursor-not-allowed rounded-2xl border border-border bg-muted/40 px-4 py-2 text-sm text-muted-foreground opacity-70"
              disabled
              title="Coming later: requires a real OCR reprocess endpoint"
              type="button"
            >
              Re-run OCR
            </button>
            <button
              className="cursor-not-allowed rounded-2xl border border-border bg-muted/40 px-4 py-2 text-sm text-muted-foreground opacity-70"
              disabled
              title="Coming later: requires an audited OCR review endpoint"
              type="button"
            >
              Approve / reject
            </button>
          </div>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Unsupported receipt actions are disabled until OCR processing, audited review, and secure file preview endpoints exist.
        </p>
        {actionMessage ? <p className="mt-3 text-sm text-emerald-600">{actionMessage}</p> : null}
      </div>

      {data.length === 0 ? (
        <EmptyState title="No receipts found" description="No receipt/OCR records are available yet." />
      ) : (
        <DataTable
          data={data}
          globalFilter={search}
          onGlobalFilterChange={setSearch}
          columns={[
            {
              header: "File / receipt",
              cell: ({ row }) => (
                <div>
                  <p className="font-medium">{row.original.originalFileName ?? `Receipt ${row.original.id}`}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{row.original.preview ?? "No OCR preview available"}</p>
                </div>
              ),
            },
            { header: "User", cell: ({ row }) => row.original.uploadedByEmail ?? "Not available" },
            { header: "Group", cell: ({ row }) => row.original.groupId ?? "Not linked" },
            { header: "Expense", cell: ({ row }) => row.original.expenseId ?? "Not linked" },
            { header: "OCR status", cell: ({ row }) => <StatusBadge value={row.original.ocrStatus.toLowerCase()} /> },
            { header: "Review status", cell: ({ row }) => <StatusBadge value={row.original.reviewStatus.toLowerCase()} /> },
            {
              header: "Amount",
              cell: ({ row }) => row.original.ocrAmount != null ? <MoneyAmount amount={row.original.ocrAmount} /> : "Not available",
            },
            {
              header: "Confidence",
              cell: ({ row }) => row.original.ocrConfidence != null ? `${Math.round(row.original.ocrConfidence * 100)}%` : "Not available",
            },
            {
              header: "Created date",
              cell: ({ row }) => row.original.createdAt ? formatDateTime(row.original.createdAt) : "Not available",
            },
            {
              header: "Actions",
              cell: () => (
                <button
                  className="cursor-not-allowed rounded-2xl border border-border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground opacity-70"
                  disabled
                  title="Coming later: receipt detail and secure file preview are not implemented in the admin UI yet"
                  type="button"
                >
                  View
                </button>
              ),
            },
          ]}
          searchPlaceholder="Search receipts..."
        />
      )}
    </div>
  );

  function exportReceiptsCsv(receipts: Receipt[]) {
    try {
      const headers = [
        "id",
        "originalFileName",
        "uploadedByEmail",
        "groupId",
        "expenseId",
        "ocrStatus",
        "reviewStatus",
        "ocrMerchant",
        "ocrAmount",
        "ocrCurrency",
        "ocrDate",
        "ocrConfidence",
        "createdAt",
      ];
      const rows = receipts.map((receipt) => [
        receipt.id,
        receipt.originalFileName,
        receipt.uploadedByEmail,
        receipt.groupId,
        receipt.expenseId,
        receipt.ocrStatus,
        receipt.reviewStatus,
        receipt.ocrMerchant,
        receipt.ocrAmount,
        receipt.ocrCurrency,
        receipt.ocrDate,
        receipt.ocrConfidence,
        receipt.createdAt,
      ]);
      const csv = [headers, ...rows].map((row) => row.map(escapeCsvValue).join(",")).join("\r\n");
      const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "hssabna-receipts.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setActionMessage("Receipt CSV exported.");
    } catch {
      setActionMessage("Unable to export receipt CSV.");
    }
  }
}

function escapeCsvValue(value: string | number | null | undefined) {
  const text = value == null ? "" : String(value);
  const escaped = text.replace(/"/g, '""');
  return /[",\r\n]/.test(escaped) ? `"${escaped}"` : escaped;
}
