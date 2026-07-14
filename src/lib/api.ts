import axios, { AxiosHeaders } from "axios";
import {
  auditLogs,
  expenses,
  groups,
  permissionsCatalog,
  reminderTemplates,
  remoteConfig,
  securityHighlights,
  settlements,
  users,
} from "@/lib/mock-data";
import { delay } from "@/lib/utils";
import { clearPersistedAuth, notifyAuthExpired, readPersistedAuthToken } from "@/lib/authStorage";
import type { ConfigResponse, ConfigSetting } from "@/types/config";
import type { Group, GroupStatus, GroupType } from "@/types/group";
import type { OcrStatus, Receipt, ReceiptReviewStatus } from "@/types/receipt";
import type { SupportCategory, SupportTicket } from "@/types/support";
import type { User, UserStatus } from "@/types/user";

interface AdminDashboardResponse {
  totalUsers: number;
  activeUsers: number;
  totalGroups: number;
  totalExpenses: number;
  totalExpenseAmount: number;
  pendingFriendRequests: number;
  recentUsers: unknown[];
  recentGroups: unknown[];
}

interface DashboardData {
  metrics: {
    totalUsers: number;
    activeUsers: number;
    totalGroups: number;
    totalExpenses: number;
    totalExpenseAmount: number;
    pendingFriendRequests: number;
    recentUsersCount: number;
    recentGroupsCount: number;
    friendshipHealth: number;
    awkwardnessRisk: number;
    settlementVelocity: number;
    receiptScanConfidence: number;
    reminderConversionRate: number;
  };
  recentUsers: unknown[];
  recentGroups: unknown[];
  expenseVolume: { month: string; amount: number }[];
  userGrowth: { month: string; users: number; active: number }[];
  categoryBreakdown: { name: string; value: number }[];
  topSpendingMoments: { label: string; value: number }[];
}

interface AdminUserDTO {
  id: number;
  email: string | null;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  role: string | null;
  currencyCode: string | null;
  onboardingCompleted: boolean | null;
  onboardingStep: number | null;
  createdAt: string | null;
  active: boolean;
  city: string | null;
}

interface AdminUserDetailDTO extends AdminUserDTO {
  groupsCount: number;
  expensesCount: number;
  totalExpenseAmount: number;
  friendsCount: number;
  groups: AdminUserGroupDTO[];
}

interface AdminUserGroupDTO {
  id: number;
  name: string | null;
  description: string | null;
  membersCount: number;
  expensesCount: number;
  totalExpenseAmount: number;
  role: string | null;
  createdAt: string | null;
  status: string | null;
}

interface AdminUserPageResponse {
  items: AdminUserDTO[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

interface GetUsersParams {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
}

interface AdminGroupDTO {
  id: number;
  name: string | null;
  description: string | null;
  creatorId: number | null;
  creatorEmail: string | null;
  creatorName: string | null;
  membersCount: number;
  expensesCount: number;
  totalExpenseAmount: number;
  createdAt: string | null;
  status: string | null;
  frozenAt: string | null;
  frozenReason: string | null;
}

interface AdminGroupDetailDTO extends AdminGroupDTO {
  members: AdminGroupMemberDTO[];
  expenses: AdminGroupExpenseDTO[];
}

interface AdminGroupMemberDTO {
  id: number;
  email: string | null;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  role: string | null;
  totalPaid: number;
}

interface AdminGroupExpenseDTO {
  id: number;
  description: string | null;
  amount: number;
  payerId: number | null;
  payerName: string | null;
  date: string | null;
}

interface AdminGroupPageResponse {
  items: AdminGroupDTO[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

interface GetGroupsParams {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
}

interface AdminSupportTicketDTO {
  id: number;
  subject: string | null;
  email: string | null;
  status: string | null;
  priority: string | null;
  category: SupportCategory | null;
  source: string | null;
  createdAt: string | null;
  preview: string | null;
}

interface AdminSupportTicketPageResponse {
  items: AdminSupportTicketDTO[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

interface GetSupportTicketsParams {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  priority?: string;
  category?: string;
}

interface AdminReceiptDTO {
  id: number;
  expenseId: number | null;
  groupId: number | null;
  uploadedByUserId: number | null;
  uploadedByEmail: string | null;
  originalFileName: string | null;
  contentType: string | null;
  sizeBytes: number | null;
  ocrStatus: string | null;
  reviewStatus: string | null;
  ocrMerchant: string | null;
  ocrAmount: number | null;
  ocrCurrency: string | null;
  ocrDate: string | null;
  ocrConfidence: number | null;
  createdAt: string | null;
  preview: string | null;
}

interface AdminReceiptPageResponse {
  items: AdminReceiptDTO[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

interface GetReceiptsParams {
  page?: number;
  size?: number;
  search?: string;
  ocrStatus?: string;
  reviewStatus?: string;
}

// TODO: Replace this mock API with authenticated backend endpoints for the admin back office.
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
});

http.interceptors.request.use((config) => {
  const token = readPersistedAuthToken();

  if (token) {
    config.headers = AxiosHeaders.from(config.headers);
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401 && !error.config?.url?.includes("/api/admin/auth/login")) {
      clearPersistedAuth();
      notifyAuthExpired();

      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  },
);

export const api = {
  getDashboard: async (): Promise<DashboardData> => {
    const response = await http.get<AdminDashboardResponse>("/api/admin/dashboard");
    const dashboard = response.data;

    return {
      metrics: {
        totalUsers: dashboard.totalUsers,
        activeUsers: dashboard.activeUsers,
        totalGroups: dashboard.totalGroups,
        totalExpenses: dashboard.totalExpenses,
        totalExpenseAmount: dashboard.totalExpenseAmount,
        pendingFriendRequests: dashboard.pendingFriendRequests,
        recentUsersCount: dashboard.recentUsers.length,
        recentGroupsCount: dashboard.recentGroups.length,
        friendshipHealth: 0,
        awkwardnessRisk: 0,
        settlementVelocity: 0,
        receiptScanConfidence: 0,
        reminderConversionRate: 0,
      },
      recentUsers: dashboard.recentUsers,
      recentGroups: dashboard.recentGroups,
      expenseVolume: [],
      userGrowth: [],
      categoryBreakdown: [],
      topSpendingMoments: [],
    };
  },
  getUsers: async ({ page = 0, size = 100, search, status }: GetUsersParams = {}): Promise<User[]> => {
    const response = await http.get<AdminUserPageResponse>("/api/admin/users", {
      params: {
        page,
        size,
        search: search?.trim() || undefined,
        status: status || undefined,
      },
    });

    return response.data.items.map((user) => {
      const name = [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || user.username || user.email || `User ${user.id}`;
      const createdAt = user.createdAt ?? new Date(0).toISOString();
      const userStatus: UserStatus = user.active ? (user.onboardingCompleted ? "verified" : "active") : "blocked";

      return {
        id: String(user.id),
        username: user.username,
        name,
        email: user.email ?? "",
        phone: user.phoneNumber ?? "Not provided",
        city: user.city ?? "Not provided",
        platform: "Unknown" as const,
        appVersion: "N/A",
        status: userStatus,
        riskScore: 0,
        totalPaid: 0,
        totalOwed: 0,
        lastActive: createdAt,
        joinedAt: createdAt,
        avatar: name.slice(0, 2).toUpperCase(),
        trusted: Boolean(user.onboardingCompleted),
        device: "Not available",
        notes: [],
        role: user.role,
        currencyCode: user.currencyCode,
        onboardingCompleted: user.onboardingCompleted,
        onboardingStep: user.onboardingStep,
      };
    });
  },
  getUser: async (id: string) => api.getUserById(id),
  getUserById: async (userId: string): Promise<User | null> => {
    try {
      const response = await http.get<AdminUserDetailDTO>(`/api/admin/users/${userId}`);
      const user = response.data;
      const name = [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || user.username || user.email || `User ${user.id}`;
      const createdAt = user.createdAt ?? new Date(0).toISOString();
      const userStatus: UserStatus = user.active ? (user.onboardingCompleted ? "verified" : "active") : "blocked";

      return {
        id: String(user.id),
        username: user.username,
        name,
        email: user.email ?? "",
        phone: user.phoneNumber ?? "Not provided",
        city: user.city ?? "Not provided",
        platform: "Unknown" as const,
        appVersion: "N/A",
        status: userStatus,
        riskScore: 0,
        totalPaid: user.totalExpenseAmount,
        totalOwed: 0,
        lastActive: createdAt,
        joinedAt: createdAt,
        avatar: name.slice(0, 2).toUpperCase(),
        trusted: Boolean(user.onboardingCompleted),
        device: "Not available",
        role: user.role,
        currencyCode: user.currencyCode,
        onboardingCompleted: user.onboardingCompleted,
        onboardingStep: user.onboardingStep,
        groupsCount: user.groupsCount,
        expensesCount: user.expensesCount,
        friendsCount: user.friendsCount,
        groups: (user.groups ?? []).map((group) => ({
          id: String(group.id),
          name: group.name ?? `Group ${group.id}`,
          type: "custom",
          memberIds: Array.from({ length: group.membersCount }, (_, index) => `${group.id}-member-${index + 1}`),
          membersCount: group.membersCount,
          expensesCount: group.expensesCount,
          totalVolume: group.totalExpenseAmount,
          unsettledAmount: 0,
          healthScore: 100,
          status: group.status === "ACTIVE" ? "healthy" : "watch",
          inviteLinkActive: false,
        })),
        notes: [],
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },
  getGroups: async ({ page = 0, size = 100, search, status }: GetGroupsParams = {}): Promise<Group[]> => {
    const response = await http.get<AdminGroupPageResponse>("/api/admin/groups", {
      params: {
        page,
        size,
        search: search?.trim() || undefined,
        status: status || undefined,
      },
    });

    return response.data.items.map(mapAdminGroup);
  },
  getGroup: async (id: string) => api.getGroupById(id),
  getGroupById: async (groupId: string): Promise<Group | null> => {
    try {
      const response = await http.get<AdminGroupDetailDTO>(`/api/admin/groups/${groupId}`);
      const group = response.data;

      return {
        ...mapAdminGroup(group),
        members: (group.members ?? []).map((member) => {
          const name =
            [member.firstName, member.lastName].filter(Boolean).join(" ").trim()
            || member.username
            || member.email
            || `User ${member.id}`;

          return {
            id: String(member.id),
            name,
            email: member.email ?? "",
            username: member.username,
            role: member.role ?? "MEMBER",
            totalPaid: member.totalPaid,
          };
        }),
        expenses: (group.expenses ?? []).map((expense) => ({
          id: String(expense.id),
          title: expense.description ?? `Expense ${expense.id}`,
          groupId: String(group.id),
          paidBy: expense.payerId != null ? String(expense.payerId) : "",
          payerName: expense.payerName ?? "Not available",
          amount: expense.amount,
          payerId: expense.payerId != null ? String(expense.payerId) : "",
          category: "Event",
          source: "manual",
          status: "active",
          ocrConfidence: 0,
          createdAt: expense.date ?? "",
          merchant: "Not available",
          splitBetween: [],
          extractionNotes: [],
        })),
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },
  freezeGroup: async (groupId: string, reason: string): Promise<Group | null> => {
    const response = await http.post<AdminGroupDetailDTO>(`/api/admin/groups/${groupId}/freeze`, { reason });
    const group = response.data;

    return {
      ...mapAdminGroup(group),
      members: (group.members ?? []).map((member) => {
        const name =
          [member.firstName, member.lastName].filter(Boolean).join(" ").trim()
          || member.username
          || member.email
          || `User ${member.id}`;

        return {
          id: String(member.id),
          name,
          email: member.email ?? "",
          username: member.username,
          role: member.role ?? "MEMBER",
          totalPaid: member.totalPaid,
        };
      }),
      expenses: (group.expenses ?? []).map((expense) => ({
        id: String(expense.id),
        title: expense.description ?? `Expense ${expense.id}`,
        groupId: String(group.id),
        paidBy: expense.payerId != null ? String(expense.payerId) : "",
        payerName: expense.payerName ?? "Not available",
        amount: expense.amount,
        payerId: expense.payerId != null ? String(expense.payerId) : "",
        category: "Event",
        source: "manual",
        status: "active",
        ocrConfidence: 0,
        createdAt: expense.date ?? "",
        merchant: "Not available",
        splitBetween: [],
        extractionNotes: [],
      })),
    };
  },
  getGroupsByUserId: async (userId: string) => delay(groups.filter((group) => group.memberIds.includes(userId))),
  getExpenses: async () => delay(expenses),
  getExpensesByGroupId: async (groupId: string) => delay(expenses.filter((expense) => expense.groupId === groupId)),
  getExpense: async (id: string) => delay(expenses.find((expense) => expense.id === id) ?? null),
  getExpenseById: async (expenseId: string) => delay(expenses.find((expense) => expense.id === expenseId) ?? null),
  getExpensesByUserId: async (userId: string) =>
    delay(expenses.filter((expense) => expense.paidBy === userId || expense.splitBetween.includes(userId))),
  getSettlements: async () => delay(settlements),
  getSupportTickets: async ({ page = 0, size = 100, search, status, priority, category }: GetSupportTicketsParams = {}): Promise<SupportTicket[]> => {
    const response = await http.get<AdminSupportTicketPageResponse>("/api/admin/support/tickets", {
      params: {
        page,
        size,
        search: search?.trim() || undefined,
        status: status || undefined,
        priority: priority || undefined,
        category: category || undefined,
      },
    });

    return response.data.items.map(mapAdminSupportTicket);
  },
  getReceipts: async ({ page = 0, size = 100, search, ocrStatus, reviewStatus }: GetReceiptsParams = {}): Promise<Receipt[]> => {
    const response = await http.get<AdminReceiptPageResponse>("/api/admin/receipts", {
      params: {
        page,
        size,
        search: search?.trim() || undefined,
        ocrStatus: ocrStatus || undefined,
        reviewStatus: reviewStatus || undefined,
      },
    });

    return response.data.items.map(mapAdminReceipt);
  },
  getAdminConfig: async (): Promise<ConfigResponse> => {
    const response = await http.get<ConfigResponse>("/api/admin/config");
    return response.data;
  },
  updateAdminConfig: async (key: string, value: string): Promise<ConfigSetting> => {
    const response = await http.put<ConfigSetting>(`/api/admin/config/${encodeURIComponent(key)}`, { value });
    return response.data;
  },
  getSecurity: async () => delay(securityHighlights),
  getAuditLogs: async () => delay(auditLogs),
  getReminders: async () => delay(reminderTemplates),
  getRemoteConfig: async () => delay(remoteConfig),
  getPermissionsCatalog: async () => delay(permissionsCatalog),
};

function mapAdminSupportTicket(ticket: AdminSupportTicketDTO): SupportTicket {
  return {
    id: String(ticket.id),
    email: ticket.email ?? "Not available",
    subject: ticket.subject ?? `Support ticket ${ticket.id}`,
    message: ticket.preview ?? "",
    status: mapSupportStatus(ticket.status),
    priority: mapSupportPriority(ticket.priority),
    category: ticket.category ?? "GENERAL_HELP",
    source: ticket.source ?? "CONTACT_FORM",
    createdAt: ticket.createdAt ?? new Date(0).toISOString(),
  };
}

function mapAdminReceipt(receipt: AdminReceiptDTO): Receipt {
  return {
    id: String(receipt.id),
    expenseId: receipt.expenseId != null ? String(receipt.expenseId) : null,
    groupId: receipt.groupId != null ? String(receipt.groupId) : null,
    uploadedByUserId: receipt.uploadedByUserId != null ? String(receipt.uploadedByUserId) : null,
    uploadedByEmail: receipt.uploadedByEmail,
    originalFileName: receipt.originalFileName,
    contentType: receipt.contentType,
    sizeBytes: receipt.sizeBytes,
    ocrStatus: mapOcrStatus(receipt.ocrStatus),
    reviewStatus: mapReceiptReviewStatus(receipt.reviewStatus),
    ocrMerchant: receipt.ocrMerchant,
    ocrAmount: receipt.ocrAmount,
    ocrCurrency: receipt.ocrCurrency,
    ocrDate: receipt.ocrDate,
    ocrConfidence: receipt.ocrConfidence,
    createdAt: receipt.createdAt,
    preview: receipt.preview,
  };
}

function mapOcrStatus(status: string | null): OcrStatus {
  if (status === "PROCESSING" || status === "PROCESSED" || status === "FAILED") {
    return status;
  }
  return "NOT_PROCESSED";
}

function mapReceiptReviewStatus(status: string | null): ReceiptReviewStatus {
  if (status === "REVIEWED" || status === "REJECTED") {
    return status;
  }
  return "PENDING";
}

function mapSupportStatus(status: string | null): SupportTicket["status"] {
  if (status === "CLOSED") {
    return "resolved";
  }
  if (status === "IN_PROGRESS") {
    return "pending";
  }
  return "open";
}

function mapSupportPriority(priority: string | null): SupportTicket["priority"] {
  if (priority === "HIGH") {
    return "high";
  }
  if (priority === "LOW") {
    return "low";
  }
  return "medium";
}

function mapAdminGroup(group: AdminGroupDTO): Group {
  const groupType: GroupType = "custom";
  const groupStatus: GroupStatus = group.status === "FROZEN" ? "frozen" : "healthy";

  return {
    id: String(group.id),
    name: group.name ?? `Group ${group.id}`,
    description: group.description ?? undefined,
    type: groupType,
    memberIds: Array.from({ length: group.membersCount }, (_, index) => `${group.id}-member-${index + 1}`),
    membersCount: group.membersCount,
    expensesCount: group.expensesCount,
    totalVolume: group.totalExpenseAmount,
    unsettledAmount: 0,
    healthScore: 100,
    status: groupStatus,
    inviteLinkActive: false,
    createdAt: group.createdAt,
    creatorName: group.creatorName,
    frozenAt: group.frozenAt,
    frozenReason: group.frozenReason,
  };
}
