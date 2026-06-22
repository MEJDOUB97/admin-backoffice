import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { useAuthStore } from "@/store/authStore";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });
  const isSubmitting = form.formState.isSubmitting;

  if (isAuthenticated && token) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen bg-background bg-morocco-mesh p-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl items-center">
        <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="panel flex flex-col justify-between overflow-hidden bg-sidebar p-8 text-sidebar-foreground">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-sidebar-foreground/60">Hssabna</p>
              <h1 className="mt-6 text-5xl font-semibold tracking-tight">Back Office built for split-expense trust.</h1>
              <p className="mt-4 max-w-lg text-base text-sidebar-foreground/70">
                Operations, support, security, and finance teams get a dedicated Morocco-first cockpit without touching the user app.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {["Receipt confidence", "Reminder conversion", "Group health"].map((label) => (
                <div key={label} className="rounded-3xl border border-sidebar-border bg-sidebar-accent/70 p-4">
                  <p className="text-sm text-sidebar-foreground/65">{label}</p>
                  <p className="mt-2 text-2xl font-semibold">{label === "Receipt confidence" ? "89%" : label === "Reminder conversion" ? "54%" : "76/100"}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="panel p-8">
            <div className="mb-8 flex items-center gap-3">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Admin login</h2>
                <p className="subtle-text">Sign in with an administrator account.</p>
              </div>
            </div>
            <form
              className="space-y-5"
              onSubmit={form.handleSubmit(async (values) => {
                try {
                  await login(values.email, values.password);
                  toast.success("Signed in to Hssabna Admin.");
                  navigate("/admin", { replace: true });
                } catch (error) {
                  if (axios.isAxiosError(error) && error.response?.status === 401) {
                    toast.error("Email ou mot de passe incorrect.");
                    return;
                  }

                  if (axios.isAxiosError(error) && error.response?.status === 403) {
                    toast.error("Ce compte n'a pas les droits administrateur.");
                    return;
                  }

                  toast.error("Connexion impossible pour le moment. Veuillez réessayer.");
                }
              })}
            >
              <div>
                <label className="mb-2 block text-sm font-medium">Email</label>
                <input className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm" {...form.register("email")} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Password</label>
                <input className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm" type="password" {...form.register("password")} />
              </div>
              <button
                className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-70"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign in to Admin"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
