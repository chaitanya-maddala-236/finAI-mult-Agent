"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mail, Lock, BotMessageSquare, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/store/useStore";
import { authApi } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const tokenRes = await authApi.login({
        username: email,
        password,
      });
      const token = tokenRes.data.access_token;

      // Decode user id from JWT
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = Number(payload.sub);

      const userRes = await authApi.getProfile(userId);
      setAuth(userRes.data, token);
      router.replace("/dashboard");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel – decorative */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-primary via-purple-600 to-indigo-700 p-12 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <BotMessageSquare className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold">FinAI</span>
        </div>

        <div>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Your AI-powered<br />financial advisor
          </h2>
          <p className="text-white/80 text-lg leading-relaxed">
            Five specialised AI agents working in concert to deliver
            personalised investment advice, risk analysis, and real-time
            market insights.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { label: "Portfolio Analysis", icon: "📊" },
              { label: "Market Insights", icon: "📈" },
              { label: "Risk Profiling", icon: "🛡️" },
              { label: "AI Chat Advisor", icon: "🤖" },
            ].map(({ label, icon }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl bg-white/10 backdrop-blur-sm px-4 py-3"
              >
                <span className="text-xl">{icon}</span>
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/50 text-sm">
          © {new Date().getFullYear()} FinAI. All rights reserved.
        </p>
      </div>

      {/* Right panel – form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 flex lg:hidden items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600">
              <BotMessageSquare className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">FinAI</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="h-4 w-4" />}
              required
              autoComplete="email"
            />

            <Input
              label="Password"
              type={showPwd ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPwd((p) => !p)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {showPwd ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
              required
              autoComplete="current-password"
            />

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="gradient"
              className="w-full"
              loading={loading}
              size="lg"
            >
              Sign in
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary hover:underline"
            >
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
