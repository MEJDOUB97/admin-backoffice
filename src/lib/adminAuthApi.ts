import { http } from "@/lib/api";
import type { AdminLoginResponse, AdminUser } from "@/types/admin";

export async function adminLogin(email: string, password: string) {
  const response = await http.post<AdminLoginResponse>("/api/admin/auth/login", {
    email,
    password,
  });

  return response.data;
}

export async function getCurrentAdmin() {
  const response = await http.get<AdminUser>("/api/admin/auth/me");
  return response.data;
}
