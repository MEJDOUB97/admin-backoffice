import { Home, LifeBuoy, Receipt, Settings2, ShieldAlert, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const links = [
  { to: "/admin", label: "Dashboard", icon: Home },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/receipts", label: "Receipts / OCR", icon: Receipt },
  { to: "/admin/support", label: "Support", icon: LifeBuoy },
  { to: "/admin/security", label: "Security", icon: ShieldAlert },
  { to: "/admin/config", label: "Config", icon: Settings2 },
];

export default function AdminSidebar() {
  return (
    <aside className="hidden w-72 shrink-0 rounded-[28px] border border-sidebar-border bg-sidebar bg-morocco-mesh p-5 text-sidebar-foreground lg:block">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-sidebar-foreground/60">Hssabna</p>
        <h1 className="mt-2 text-2xl font-semibold">Admin Back Office</h1>
        <p className="mt-2 text-sm text-sidebar-foreground/70">Morocco-focused split expense operations and trust tooling.</p>
      </div>
      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/admin"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition hover:bg-sidebar-accent/70",
                isActive && "bg-sidebar-accent shadow-lg",
              )
            }
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
