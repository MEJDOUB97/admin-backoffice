import { Menu, Moon, Search, Sun, Languages, LogOut } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";

export default function AdminTopbar() {
  const pathname = useLocation().pathname;
  const admin = useAuthStore((state) => state.admin);
  const logout = useAuthStore((state) => state.logout);
  const toggleTheme = useUiStore((state) => state.toggleTheme);
  const toggleDirection = useUiStore((state) => state.toggleDirection);
  const theme = useUiStore((state) => state.theme);

  return (
    <div className="panel flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl border border-border p-2 lg:hidden">
          <Menu className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Admin route</p>
          <h2 className="text-xl font-semibold capitalize">{pathname.replace("/admin/", "").replace("/admin", "overview")}</h2>
        </div>
      </div>
      <div className="flex flex-1 items-center gap-3 md:max-w-xl">
        <div className="flex flex-1 items-center gap-2 rounded-2xl border border-border bg-background px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input className="w-full bg-transparent text-sm" placeholder="Search users, groups, settlements..." />
        </div>
        <button className="rounded-2xl border border-border p-2" onClick={toggleTheme}>
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <button className="rounded-2xl border border-border p-2" onClick={toggleDirection}>
          <Languages className="h-4 w-4" />
        </button>
        <button className="rounded-2xl border border-border p-2" onClick={logout}>
          <LogOut className="h-4 w-4" />
        </button>
        <div className="hidden rounded-2xl bg-muted px-3 py-2 text-sm md:block">
          {admin?.name}
        </div>
      </div>
    </div>
  );
}
