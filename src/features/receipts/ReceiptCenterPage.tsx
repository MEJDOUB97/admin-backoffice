import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import EmptyState from "@/components/common/EmptyState";
import LoadingState from "@/components/common/LoadingState";
import MoneyAmount from "@/components/common/MoneyAmount";
import StatusBadge from "@/components/common/StatusBadge";
import { formatDateTime } from "@/lib/format";
import { api } from "@/lib/api";
import type { Receipt } from "@/types/receipt";

const pageSize = 20;

const ocrStatusOptions = [
  { value: "", label: "All OCR statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "PROCESSING", label: "Processing" },
  { value: "COMPLETED", label: "Completed" },
  { value: "FAILED", label: "Failed" },
];

const reviewStatusOptions = [
  { value: "", label: "All review statuses" },
  { value: "PENDING_REVIEW", label: "Pending review" },
  { value: "APPROVED", label: "Approved" },
  { value: "NEEDS_REVIEW", label: "Needs review" },
  { value: "REJECTED", label: "Rejected" },
];

export default function ReceiptCenterPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [ocrStatus, setOcrStatus] = useState("");
  const [reviewStatus, setReviewStatus] = useState("");
  const [page, setPage] = useState(0);
  const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const receiptsQuery = useQuery({
    queryKey: ["receipts", page, pageSize, search, ocrStatus, reviewStatus],
    queryFn: () => api.getReceipts({ page, size: pageSize, search, ocrStatus, reviewStatus }),
  });

  const detailQuery = useQuery({
    queryKey: ["receipt", selectedReceiptId],
    queryFn: () => selectedReceiptId ? api.getReceiptById(selectedReceiptId) : Promise.resolve(null),
    enabled: selectedReceiptId != null,
  });

  const receipts = receiptsQuery.data?.items ?? [];
  const totalPages = receiptsQuery.data?.totalPages ?? 0;
  const totalItems = receiptsQuery.data?.totalItems ?? 0;
  const canGoPrevious = page > 0;
  const canGoNext = totalPages > 0 && page + 1 < totalPages;

  const hasActiveFilters = useMemo(
    () => Boolean(search || ocrStatus || reviewStatus),
    [ocrStatus, reviewStatus, search],
  );

  if (receiptsQuery.isLoading) {
    return <LoadingState label="Loading receipts..." />;
  }

  if (receiptsQuery.isError) {
    return (
      <div className="space-y-4">
        <EmptyState title="Unable to load receipts" description="Receipt/OCR records could not be loaded from the backend right now." />
        <button
          className="rounded-2xl border border-border px-4 py-2 text-sm font-semibold"
          onClick={() => receiptsQuery.refetch()}
          type="button"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="panel p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <form
            className="grid flex-1 gap-3 md:grid-cols-[minmax(220px,1fr)_220px_220px_auto]"
            onSubmit={(event) => {
              event.preventDefault();
              setPage(0);
              setSearch(searchInput.trim());
            }}
          >
            <input
              className="rounded-2xl border border-border bg-background px-4 py-2.5 text-sm"
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search file, merchant, uploaded email"
              value={searchInput}
            />
            <select
              className="rounded-2xl border border-border bg-background px-4 py-2.5 text-sm"
              onChange={(event) => {
                setPage(0);
                setOcrStatus(event.target.value);
              }}
              value={ocrStatus}
            >
              {ocrStatusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <select
              className="rounded-2xl border border-border bg-background px-4 py-2.5 text-sm"
              onChange={(event) => {
                setPage(0);
                setReviewStatus(event.target.value);
              }}
              value={reviewStatus}
            >
              {reviewStatusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <button className="rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground" type="submit">
              Search
            </button>
          </form>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-2xl border border-border px-4 py-2 text-sm" onClick={() => receiptsQuery.refetch()} type="button">
              Refresh
            </button>
            <button className="rounded-2xl border border-border px-4 py-2 text-sm" onClick={() => exportReceiptsCsv(receipts)} type="button">
              Export CSV
            </button>
            {hasActiveFilters ? (
              <button
                className="rounded-2xl border border-border px-4 py-2 text-sm"
                onClick={() => {
                  setPage(0);
                  setSearch("");
                  setSearchInput("");
                  setOcrStatus("");
                  setReviewStatus("");
                }}
                type="button"
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>
        {actionMessage ? <p className="mt-3 text-sm text-emerald-600">{actionMessage}</p> : null}
      </div>

      {receipts.length === 0 ? (
        <EmptyState title="No receipts found" description="No receipt/OCR records match the current query." />
      ) : (
        <div className="panel p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">{totalItems} receipt{totalItems === 1 ? "" : "s"}</p>
            <p className="text-sm text-muted-foreground">Page {totalPages === 0 ? 0 : page + 1} of {totalPages}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-muted-foreground">
                <tr>
                  <th className="border-b border-border px-3 py-3 font-medium">File name</th>
                  <th className="border-b border-border px-3 py-3 font-medium">Merchant</th>
                  <th className="border-b border-border px-3 py-3 font-medium">Amount</th>
                  <th className="border-b border-border px-3 py-3 font-medium">OCR status</th>
                  <th className="border-b border-border px-3 py-3 font-medium">Review status</th>
                  <th className="border-b border-border px-3 py-3 font-medium">Confidence</th>
                  <th className="border-b border-border px-3 py-3 font-medium">Uploaded by</th>
                  <th className="border-b border-border px-3 py-3 font-medium">Links</th>
                  <th className="border-b border-border px-3 py-3 font-medium">Created</th>
                  <th className="border-b border-border px-3 py-3 font-medium">File</th>
                  <th className="border-b border-border px-3 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {receipts.map((receipt) => (
                  <tr key={receipt.id} className="border-b border-border/60 last:border-0">
                    <td className="px-3 py-3 align-top">
                      <p className="font-medium">{receipt.originalFileName ?? `Receipt ${receipt.id}`}</p>
                    </td>
                    <td className="px-3 py-3 align-top">{receipt.ocrMerchant ?? "Not available"}</td>
                    <td className="px-3 py-3 align-top">
                      {receipt.ocrAmount != null ? (
                        <MoneyAmount amount={receipt.ocrAmount} />
                      ) : "Not available"}
                    </td>
                    <td className="px-3 py-3 align-top"><StatusBadge value={receipt.ocrStatus.toLowerCase()} /></td>
                    <td className="px-3 py-3 align-top"><StatusBadge value={receipt.reviewStatus.toLowerCase()} /></td>
                    <td className="px-3 py-3 align-top">{formatConfidence(receipt.ocrConfidence)}</td>
                    <td className="px-3 py-3 align-top">{receipt.uploadedByEmail ?? "Not available"}</td>
                    <td className="px-3 py-3 align-top">
                      <div className="space-y-1">
                        <p>Group: {receipt.groupId ?? "Not linked"}</p>
                        <p>Expense: {receipt.expenseId ?? "Not linked"}</p>
                      </div>
                    </td>
                    <td className="px-3 py-3 align-top">{receipt.createdAt ? formatDateTime(receipt.createdAt) : "Not available"}</td>
                    <td className="px-3 py-3 align-top">
                      <div className="space-y-1">
                        <p>{receipt.contentType ?? "Unknown type"}</p>
                        <p className="text-xs text-muted-foreground">{formatBytes(receipt.sizeBytes)}</p>
                      </div>
                    </td>
                    <td className="px-3 py-3 align-top">
                      <button
                        className="rounded-2xl border border-border px-3 py-1.5 text-xs"
                        onClick={() => setSelectedReceiptId(receipt.id)}
                        type="button"
                      >
                        View details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <button className="rounded-2xl border border-border px-4 py-2 text-sm disabled:opacity-50" onClick={() => setPage((value) => value - 1)} disabled={!canGoPrevious}>
              Previous
            </button>
            <button className="rounded-2xl border border-border px-4 py-2 text-sm disabled:opacity-50" onClick={() => setPage((value) => value + 1)} disabled={!canGoNext}>
              Next
            </button>
          </div>
        </div>
      )}

      {selectedReceiptId ? (
        <ReceiptDetailPanel
          isLoading={detailQuery.isLoading}
          onClose={() => setSelectedReceiptId(null)}
          receipt={detailQuery.data ?? null}
        />
      ) : null}
    </div>
  );

  function exportReceiptsCsv(currentReceipts: Receipt[]) {
    try {
      const headers = [
        "id",
        "originalFileName",
        "ocrMerchant",
        "ocrAmount",
        "ocrCurrency",
        "ocrDate",
        "ocrConfidence",
        "ocrStatus",
        "reviewStatus",
        "uploadedByEmail",
        "groupId",
        "expenseId",
        "createdAt",
      ];
      const rows = currentReceipts.map((receipt) => [
        receipt.id,
        receipt.originalFileName,
        receipt.ocrMerchant,
        receipt.ocrAmount,
        receipt.ocrCurrency,
        receipt.ocrDate,
        receipt.ocrConfidence,
        receipt.ocrStatus,
        receipt.reviewStatus,
        receipt.uploadedByEmail,
        receipt.groupId,
        receipt.expenseId,
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

function ReceiptDetailPanel({ isLoading, onClose, receipt }: { isLoading: boolean; onClose: () => void; receipt: Receipt | null }) {
  return (
    <div className="panel p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="section-title">Receipt details</h3>
          <p className="subtle-text">Loaded from GET /api/admin/receipts/id.</p>
        </div>
        <button className="rounded-2xl border border-border px-4 py-2 text-sm" onClick={onClose} type="button">
          Close
        </button>
      </div>
      {isLoading ? (
        <LoadingState label="Loading receipt details..." />
      ) : receipt ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <DetailItem label="File name" value={receipt.originalFileName} />
          <DetailItem label="Merchant" value={receipt.ocrMerchant} />
          <DetailItem label="Amount" value={receipt.ocrAmount != null ? `${receipt.ocrCurrency ?? "MAD"} ${receipt.ocrAmount}` : null} />
          <DetailItem label="OCR date" value={receipt.ocrDate} />
          <DetailItem label="OCR confidence" value={formatConfidence(receipt.ocrConfidence)} />
          <DetailItem label="OCR status" value={receipt.ocrStatus} />
          <DetailItem label="Review status" value={receipt.reviewStatus} />
          <DetailItem label="Uploaded by" value={receipt.uploadedByName ?? receipt.uploadedByEmail} />
          <DetailItem label="Group" value={receipt.groupName ?? receipt.groupId} />
          <DetailItem label="Expense" value={receipt.expenseTitle ?? receipt.expenseId} />
          <DetailItem label="File type" value={receipt.contentType} />
          <DetailItem label="File size" value={formatBytes(receipt.sizeBytes)} />
          <DetailItem label="Created" value={receipt.createdAt ? formatDateTime(receipt.createdAt) : null} />
          <DetailItem label="Updated" value={receipt.updatedAt ? formatDateTime(receipt.updatedAt) : null} />
        </div>
      ) : (
        <EmptyState title="Receipt not found" description="The selected receipt could not be loaded." />
      )}
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="subtle-text">{label}</p>
      <p className="mt-2 break-words text-sm font-medium">{value ?? "Not available"}</p>
    </div>
  );
}

function formatConfidence(value: number | null | undefined) {
  if (value == null) {
    return "Not available";
  }
  return `${Math.round(value <= 1 ? value * 100 : value)}%`;
}

function formatBytes(value: number | null | undefined) {
  if (value == null) {
    return "Size not available";
  }
  if (value < 1024) {
    return `${value} B`;
  }
  if (value < 1024 * 1024) {
    return `${(value / 1024).toFixed(1)} KB`;
  }
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function escapeCsvValue(value: string | number | null | undefined) {
  const text = value == null ? "" : String(value);
  const escaped = text.replace(/"/g, '""');
  return /[",\r\n]/.test(escaped) ? `"${escaped}"` : escaped;
}
