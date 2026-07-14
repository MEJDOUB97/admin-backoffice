import type { AuditEvent, Permission } from "@/types/admin";
import type { Expense } from "@/types/expense";
import type { Group } from "@/types/group";
import type { Settlement } from "@/types/settlement";
import type { SupportTicket } from "@/types/support";
import type { User } from "@/types/user";

export const users: User[] = [
  { id: "u1", name: "Amira El Idrissi", email: "amira@hssabna.ma", phone: "+212600111111", city: "Casablanca", platform: "iOS", appVersion: "2.8.4", status: "verified", riskScore: 14, totalPaid: 18600, totalOwed: 2400, lastActive: "2026-06-02T09:14:00Z", joinedAt: "2025-11-14T10:00:00Z", avatar: "AE", trusted: true, device: "iPhone 15", notes: ["Prefers French support", "Runs two large travel groups"] },
  { id: "u2", name: "Youssef Alaoui", email: "youssef@hssabna.ma", phone: "+212600222222", city: "Rabat", platform: "Android", appVersion: "2.8.1", status: "active", riskScore: 28, totalPaid: 9100, totalOwed: 3300, lastActive: "2026-06-02T10:04:00Z", joinedAt: "2026-01-21T10:00:00Z", avatar: "YA", trusted: false, device: "Pixel 8", notes: ["Frequently edits scanned receipts"] },
  { id: "u3", name: "Sara Benkirane", email: "sara@hssabna.ma", phone: "+212600333333", city: "Marrakech", platform: "iOS", appVersion: "2.8.4", status: "new", riskScore: 11, totalPaid: 2900, totalOwed: 1250, lastActive: "2026-06-01T22:20:00Z", joinedAt: "2026-05-24T10:00:00Z", avatar: "SB", trusted: false, device: "iPhone 14", notes: ["Joined from referral campaign"] },
  { id: "u4", name: "Omar Tazi", email: "omar@hssabna.ma", phone: "+212600444444", city: "Tangier", platform: "Android", appVersion: "2.7.9", status: "suspicious", riskScore: 87, totalPaid: 4600, totalOwed: 8400, lastActive: "2026-05-31T16:40:00Z", joinedAt: "2025-08-08T10:00:00Z", avatar: "OT", trusted: false, device: "Galaxy S24", notes: ["Shared device fingerprint with another account"] },
  { id: "u5", name: "Laila Amrani", email: "laila@hssabna.ma", phone: "+212600555555", city: "Agadir", platform: "iOS", appVersion: "2.8.0", status: "active", riskScore: 21, totalPaid: 11800, totalOwed: 900, lastActive: "2026-06-02T08:42:00Z", joinedAt: "2025-07-20T10:00:00Z", avatar: "LA", trusted: true, device: "iPhone 13", notes: ["Uses Darija reminder templates"] },
  { id: "u6", name: "Mehdi Kabbaj", email: "mehdi@hssabna.ma", phone: "+212600666666", city: "Fes", platform: "Android", appVersion: "2.8.2", status: "blocked", riskScore: 76, totalPaid: 1700, totalOwed: 5100, lastActive: "2026-05-26T18:02:00Z", joinedAt: "2025-10-01T10:00:00Z", avatar: "MK", trusted: false, device: "Redmi Note 13", notes: ["Blocked after payment proof dispute"] },
  { id: "u7", name: "Salma Chraibi", email: "salma@hssabna.ma", phone: "+212600777777", city: "Casablanca", platform: "Android", appVersion: "2.8.4", status: "verified", riskScore: 9, totalPaid: 14200, totalOwed: 1200, lastActive: "2026-06-02T11:21:00Z", joinedAt: "2025-06-18T10:00:00Z", avatar: "SC", trusted: true, device: "Galaxy Z Flip", notes: ["Finance reviewer favorite for clean receipts"] },
  { id: "u8", name: "Hamza Zniber", email: "hamza@hssabna.ma", phone: "+212600888888", city: "Rabat", platform: "iOS", appVersion: "2.8.3", status: "active", riskScore: 34, totalPaid: 7300, totalOwed: 4200, lastActive: "2026-06-02T07:55:00Z", joinedAt: "2025-12-03T10:00:00Z", avatar: "HZ", trusted: false, device: "iPhone 12", notes: ["Opens reminders but settles late"] },
];

export const groups: Group[] = [
  { id: "g1", name: "Weekend in Marrakech", type: "trip", memberIds: ["u1", "u2", "u3", "u7"], totalVolume: 24800, unsettledAmount: 6800, healthScore: 79, status: "healthy", inviteLinkActive: true },
  { id: "g2", name: "Casa Roommates", type: "roommates", memberIds: ["u1", "u5", "u8"], totalVolume: 31500, unsettledAmount: 4300, healthScore: 73, status: "watch", inviteLinkActive: true },
  { id: "g3", name: "Friday Dinner", type: "dinner", memberIds: ["u2", "u3", "u4", "u7"], totalVolume: 7100, unsettledAmount: 2100, healthScore: 58, status: "watch", inviteLinkActive: false },
  { id: "g4", name: "Airport Taxi", type: "taxi", memberIds: ["u1", "u4", "u8"], totalVolume: 1800, unsettledAmount: 900, healthScore: 64, status: "healthy", inviteLinkActive: false },
  { id: "g5", name: "Rent May", type: "rent", memberIds: ["u5", "u6", "u8"], totalVolume: 12000, unsettledAmount: 5200, healthScore: 41, status: "frozen", inviteLinkActive: false },
  { id: "g6", name: "Agadir Surf Trip", type: "trip", memberIds: ["u3", "u5", "u7"], totalVolume: 16500, unsettledAmount: 3300, healthScore: 84, status: "healthy", inviteLinkActive: true },
];

export const expenses: Expense[] = [
  { id: "e1", title: "Dinner at Le Petit Rocher", groupId: "g1", paidBy: "u1", amount: 1320, category: "Dinner", source: "receipt_scan", status: "active", ocrConfidence: 94, createdAt: "2026-06-01T20:14:00Z", merchant: "Le Petit Rocher", splitBetween: ["u1", "u2", "u3", "u7"], extractionNotes: ["Tip excluded", "VAT detected"], receiptImage: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=80" },
  { id: "e2", title: "Taxi Airport Pickup", groupId: "g4", paidBy: "u8", amount: 240, category: "Taxi", source: "manual", status: "flagged", ocrConfidence: 0, createdAt: "2026-05-31T18:00:00Z", merchant: "Careem", splitBetween: ["u1", "u4", "u8"], extractionNotes: ["Amount disputed by one rider"] },
  { id: "e3", title: "Coffee at Cafe Hafa", groupId: "g3", paidBy: "u2", amount: 180, category: "Coffee", source: "receipt_scan", status: "edited", ocrConfidence: 77, createdAt: "2026-05-29T17:20:00Z", merchant: "Cafe Hafa", splitBetween: ["u2", "u3", "u4", "u7"], extractionNotes: ["Merchant guessed from dictionary"], receiptImage: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=900&q=80" },
  { id: "e4", title: "Apartment Rent", groupId: "g2", paidBy: "u5", amount: 9500, category: "Rent", source: "payment_confirmation", status: "active", ocrConfidence: 100, createdAt: "2026-05-27T08:00:00Z", merchant: "Residence Atlas", splitBetween: ["u1", "u5", "u8"], extractionNotes: ["Confirmed from transfer proof"] },
  { id: "e5", title: "Groceries Marjane", groupId: "g2", paidBy: "u1", amount: 860, category: "Groceries", source: "receipt_scan", status: "active", ocrConfidence: 88, createdAt: "2026-05-26T19:30:00Z", merchant: "Marjane", splitBetween: ["u1", "u5", "u8"], extractionNotes: ["2 duplicate line items removed"], receiptImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80" },
  { id: "e6", title: "Train tickets ONCF", groupId: "g1", paidBy: "u7", amount: 1240, category: "Travel", source: "payment_confirmation", status: "active", ocrConfidence: 100, createdAt: "2026-05-24T07:45:00Z", merchant: "ONCF", splitBetween: ["u1", "u2", "u3", "u7"], extractionNotes: ["Ticket PDF matched to card charge"] },
];

export const settlements: Settlement[] = [
  { id: "s1", fromUserId: "u2", toUserId: "u1", groupId: "g1", amount: 620, status: "pending", method: "wallet", timeToSettleHours: 18, createdAt: "2026-06-01T22:14:00Z" },
  { id: "s2", fromUserId: "u8", toUserId: "u5", groupId: "g2", amount: 2800, status: "completed", method: "bank", timeToSettleHours: 4, createdAt: "2026-05-28T11:40:00Z" },
  { id: "s3", fromUserId: "u4", toUserId: "u2", groupId: "g3", amount: 340, status: "disputed", method: "cash", timeToSettleHours: 72, createdAt: "2026-05-29T18:00:00Z" },
  { id: "s4", fromUserId: "u6", toUserId: "u5", groupId: "g5", amount: 4200, status: "pending", method: "card", timeToSettleHours: 96, createdAt: "2026-05-27T10:30:00Z" }
];

export const supportTickets: SupportTicket[] = [
  { id: "t1", userId: "u4", subject: "Receipt wrong for dinner split", message: "Receipt wrong and unfair amount, ana khalest more than everybody.", status: "escalated", priority: "high", assignedTo: "Nadia", linkedEntity: "e3", createdAt: "2026-06-01T19:00:00Z" },
  { id: "t2", userId: "u6", subject: "He didn't pay after rent", message: "he didn't pay and the group is blocked now", status: "open", priority: "high", assignedTo: "Rachid", linkedEntity: "g5", createdAt: "2026-05-30T09:20:00Z" },
  { id: "t3", userId: "u3", subject: "How do I export my trip ledger?", message: "Need a clean statement for our surf trip.", status: "pending", priority: "medium", assignedTo: "Sara Ops", linkedEntity: "g6", createdAt: "2026-05-29T14:00:00Z" }
];

export const auditLogs: AuditEvent[] = [
  { id: "a1", actor: "Yasmine Bennani", action: "Blocked user", target: "Mehdi Kabbaj", reason: "Repeated payment proof manipulation", createdAt: "2026-05-28T12:32:00Z", severity: "high" },
  { id: "a2", actor: "Yasmine Bennani", action: "Freeze group", target: "Rent May", reason: "Ongoing rent dispute", createdAt: "2026-05-29T08:15:00Z", severity: "high" },
  { id: "a3", actor: "Yasmine Bennani", action: "Reverse settlement", target: "s3", reason: "Proof mismatch", createdAt: "2026-05-30T17:05:00Z", severity: "medium" },
  { id: "a4", actor: "Yasmine Bennani", action: "Change remote config", target: "Reminder cooldown", reason: "Reduce churn from over-notifying", createdAt: "2026-06-01T09:40:00Z", severity: "medium" },
  { id: "a5", actor: "Yasmine Bennani", action: "Change permissions", target: "Support Agent role", reason: "Removed settlement write access", createdAt: "2026-06-02T07:20:00Z", severity: "high" }
];

export const dashboardMetrics = {
  totalUsers: users.length,
  activeUsersToday: 6,
  totalGroups: groups.length,
  totalExpenses: expenses.length,
  totalMadVolume: groups.reduce((sum, group) => sum + group.totalVolume, 0),
  pendingSettlements: settlements.filter((settlement) => settlement.status === "pending").length,
  openSupportTickets: supportTickets.filter((ticket) => ticket.status !== "resolved").length,
  suspiciousActivity: users.filter((user) => user.status === "suspicious").length,
  friendshipHealth: 76,
  awkwardnessRisk: 43,
  settlementVelocity: 68,
  receiptScanConfidence: 89,
  reminderConversionRate: 54,
};

export const userGrowth = [
  { month: "Jan", users: 1200, active: 880 },
  { month: "Feb", users: 1530, active: 1012 },
  { month: "Mar", users: 1910, active: 1320 },
  { month: "Apr", users: 2360, active: 1640 },
  { month: "May", users: 2810, active: 1975 },
  { month: "Jun", users: 3280, active: 2250 }
];

export const expenseVolume = [
  { month: "Jan", amount: 54000 },
  { month: "Feb", amount: 72000 },
  { month: "Mar", amount: 81000 },
  { month: "Apr", amount: 93000 },
  { month: "May", amount: 118000 },
  { month: "Jun", amount: 134000 }
];

export const categoryBreakdown = [
  { name: "Rent", value: 39 },
  { name: "Travel", value: 22 },
  { name: "Dinner", value: 17 },
  { name: "Groceries", value: 12 },
  { name: "Taxi", value: 6 },
  { name: "Coffee", value: 4 }
];

export const topSpendingMoments = [
  { label: "Rent Week", value: 32 },
  { label: "Friday Nights", value: 24 },
  { label: "Trip Departures", value: 18 },
  { label: "Late Cafes", value: 11 }
];

export const reminderTemplates = [
  { name: "Friendly", tone: "Small reminder: your group balance is waiting ✨" },
  { name: "Funny", tone: "Your wallet called. It wants closure." },
  { name: "Darija", tone: "Tfkira sghira: baqi khassk tsafi l7ssab." },
  { name: "Formal French", tone: "Petit rappel: votre solde de groupe est en attente." },
  { name: "Minimal English", tone: "Friendly reminder: your shared balance is still pending." }
];

export const remoteConfig = {
  receiptScanning: true,
  smartReminders: true,
  spendingInsights: true,
  darijaReminders: true,
  groupInviteLinks: true,
  oneTapPay: false,
  paymentProofUpload: true,
  offlineExpenseDraft: true,
  minimumAppVersion: "2.8.0",
  maintenanceMode: false,
  forceUpdateMessage: "New stability fixes available for split and settlement flows.",
  defaultCurrency: "MAD",
  maxExpenseAmount: 25000,
  maxGroupSize: 24,
  inviteLinkExpirationHours: 72,
  reminderCooldownHours: 18,
  rolloutRules: "Android Rabat 70%, Casablanca all versions 100%, iOS 2.8.4 100%"
};

export const permissionsCatalog: Permission[] = [
  "users.read",
  "users.write",
  "users.block",
  "groups.read",
  "groups.write",
  "expenses.read",
  "expenses.write",
  "settlements.read",
  "settlements.write",
  "support.read",
  "support.write",
  "config.read",
  "config.write",
  "analytics.read",
  "security.read",
  "security.write",
  "audit.read",
  "admins.manage"
];
