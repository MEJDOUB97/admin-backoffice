import { create } from "zustand";
import { persist } from "zustand/middleware";
import { adminLogin, getCurrentAdmin } from "@/lib/adminAuthApi";
import { AUTH_EXPIRED_EVENT } from "@/lib/authStorage";
import type { AdminUser } from "@/types/admin";

interface AuthState {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  hasValidatedSession: boolean;
  login: (email: string, password: string) => Promise<AdminUser>;
  logout: () => void;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      admin: null,
      token: null,
      isAuthenticated: false,
      isHydrating: false,
      hasValidatedSession: false,
      login: async (email, password) => {
        const { token, user } = await adminLogin(email, password);
        set({ admin: user, token, isAuthenticated: true, hasValidatedSession: true });
        return user;
      },
      logout: () => set({ admin: null, token: null, isAuthenticated: false, hasValidatedSession: false }),
      hydrate: async () => {
        const token = get().token;

        if (!token) {
          get().logout();
          return;
        }

        set({ isHydrating: true });

        try {
          const admin = await getCurrentAdmin();
          set({ admin, isAuthenticated: true, hasValidatedSession: true });
        } catch {
          get().logout();
        } finally {
          set({ isHydrating: false });
        }
      },
    }),
    {
      name: "hssabna-admin-auth",
      partialize: (state) => ({
        admin: state.admin,
        token: state.token,
        isAuthenticated: Boolean(state.token && state.admin),
      }),
    },
  ),
);

if (typeof window !== "undefined") {
  window.addEventListener(AUTH_EXPIRED_EVENT, () => {
    useAuthStore.getState().logout();
  });
}
