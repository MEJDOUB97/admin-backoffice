import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockAdmin } from "@/lib/auth";
import type { AdminUser } from "@/types/admin";

interface AuthState {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      admin: null,
      isAuthenticated: false,
      login: () => set({ admin: mockAdmin, isAuthenticated: true }),
      logout: () => set({ admin: null, isAuthenticated: false }),
    }),
    { name: "hssabna-admin-auth" },
  ),
);
