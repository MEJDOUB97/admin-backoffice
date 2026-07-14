export type OcrStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | string;
export type ReceiptReviewStatus = "PENDING_REVIEW" | "APPROVED" | "NEEDS_REVIEW" | "REJECTED" | string;

export interface Receipt {
  id: string;
  expenseId?: string | null;
  groupId?: string | null;
  uploadedByUserId?: string | null;
  uploadedByEmail?: string | null;
  originalFileName?: string | null;
  fileUrl?: string | null;
  contentType?: string | null;
  sizeBytes?: number | null;
  ocrStatus: OcrStatus;
  reviewStatus: ReceiptReviewStatus;
  ocrMerchant?: string | null;
  ocrAmount?: number | null;
  ocrCurrency?: string | null;
  ocrDate?: string | null;
  ocrConfidence?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  preview?: string | null;
  expenseTitle?: string | null;
  groupName?: string | null;
  uploadedByName?: string | null;
}
