import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminTopbar from "@/components/layout/AdminTopbar";

export default function AdminShell() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto flex max-w-[1600px] items-start gap-6">
        <AdminSidebar />
        <main className="min-w-0 flex-1 space-y-6">
          <AdminTopbar />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
