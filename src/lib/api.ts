import axios from "axios";
import {
  auditLogs,
  categoryBreakdown,
  dashboardMetrics,
  expenseVolume,
  expenses,
  groups,
  permissionsCatalog,
  reminderTemplates,
  remoteConfig,
  securityHighlights,
  settlements,
  supportTickets,
  topSpendingMoments,
  userGrowth,
  users,
} from "@/lib/mock-data";
import { delay } from "@/lib/utils";

// TODO: Replace this mock API with authenticated backend endpoints for the admin back office.
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api/admin",
});

export const api = {
  getDashboard: async () =>
    delay({
      metrics: dashboardMetrics,
      expenseVolume,
      userGrowth,
      categoryBreakdown,
      topSpendingMoments,
    }),
  getUsers: async () => delay(users),
  getUser: async (id: string) => delay(users.find((user) => user.id === id) ?? null),
  getGroups: async () => delay(groups),
  getGroup: async (id: string) => delay(groups.find((group) => group.id === id) ?? null),
  getExpenses: async () => delay(expenses),
  getExpense: async (id: string) => delay(expenses.find((expense) => expense.id === id) ?? null),
  getSettlements: async () => delay(settlements),
  getSupportTickets: async () => delay(supportTickets),
  getSecurity: async () => delay(securityHighlights),
  getAuditLogs: async () => delay(auditLogs),
  getReminders: async () => delay(reminderTemplates),
  getRemoteConfig: async () => delay(remoteConfig),
  getPermissionsCatalog: async () => delay(permissionsCatalog),
};
