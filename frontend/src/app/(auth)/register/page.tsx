"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mail, Lock, User, BotMessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/store/useStore";
import { authApi } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    age: "",
    salary: "",
    monthly_expenses: "",
    risk_tolerance: "moderate" as "conservative" | "moderate" | "aggressive",
    financial_goals: "",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authApi.register({
        ...form,
        age: Number(form.age),
        salary: Number(form.salary),
        monthly_expenses: Number(form.monthly_expenses),
      });
      const tokenRes = await authApi.login({ username: form.email, password: form.password });
      const token = tokenRes.data.access_token;
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userRes = await authApi.getProfile(Number(payload.sub));
      setAuth(userRes.data, token);
      router.replace("/dashboard");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(msg || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600">
            <BotMessageSquare className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">FinAI</span>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Start your personalised financial journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Input label="Full Name" placeholder="Jane Doe" value={form.full_name}
                onChange={(e) => set("full_name", e.target.value)}
                leftIcon={<User className="h-4 w-4" />} required />
            </div>
            <div className="col-span-2">
              <Input label="Email" type="email" placeholder="you@example.com" value={form.email}
                onChange={(e) => set("email", e.target.value)}
                leftIcon={<Mail className="h-4 w-4" />} required />
            </div>
            <div className="col-span-2">
              <Input label="Password" type="password" placeholder="Min 8 characters" value={form.password}
                onChange={(e) => set("password", e.target.value)}
                leftIcon={<Lock className="h-4 w-4" />} required />
            </div>
            <Input label="Age" type="number" placeholder="28" value={form.age}
              onChange={(e) => set("age", e.target.value)} required />
            <div>
              <label className="mb-1.5 block text-sm font-medium">Risk Tolerance</label>
              <select className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={form.risk_tolerance} onChange={(e) => set("risk_tolerance", e.target.value)}>
                <option value="conservative">Conservative</option>
                <option value="moderate">Moderate</option>
                <option value="aggressive">Aggressive</option>
              </select>
            </div>
            <Input label="Monthly Salary (₹)" type="number" placeholder="80000" value={form.salary}
              onChange={(e) => set("salary", e.target.value)} required />
            <Input label="Monthly Expenses (₹)" type="number" placeholder="40000" value={form.monthly_expenses}
              onChange={(e) => set("monthly_expenses", e.target.value)} required />
            <div className="col-span-2">
              <Input label="Financial Goals (optional)" placeholder="Retirement, home purchase…" value={form.financial_goals}
                onChange={(e) => set("financial_goals", e.target.value)} />
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>
          )}

          <Button type="submit" variant="gradient" className="w-full" loading={loading} size="lg">
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
