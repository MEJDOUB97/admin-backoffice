import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UiState {
  theme: "dark" | "light";
  direction: "ltr" | "rtl";
  sidebarOpen: boolean;
  toggleTheme: () => void;
  toggleDirection: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      direction: "ltr",
      sidebarOpen: true,
      toggleTheme: () => set({ theme: get().theme === "dark" ? "light" : "dark" }),
      toggleDirection: () => set({ direction: get().direction === "ltr" ? "rtl" : "ltr" }),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
    }),
    { name: "hssabna-admin-ui" },
  ),
);
