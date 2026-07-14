export type OcrStatus = "NOT_PROCESSED" | "PROCESSING" | "PROCESSED" | "FAILED";
export type ReceiptReviewStatus = "PENDING" | "REVIEWED" | "REJECTED";

export interface Receipt {
  id: string;
  expenseId?: string | null;
  groupId?: string | null;
  uploadedByUserId?: string | null;
  uploadedByEmail?: string | null;
  originalFileName?: string | null;
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
  preview?: string | null;
  fileUrl?: string | null;
  expenseTitle?: string | null;
  groupName?: string | null;
  uploadedByName?: string | null;
}
