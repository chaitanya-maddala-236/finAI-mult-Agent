"use client";

import { Bell, Search, Moon, Sun } from "lucide-react";
import { useAuthStore } from "@/store/useStore";
import { getInitials } from "@/lib/utils";
import { useState, useEffect } from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { user } = useAuthStore();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("finai_theme");
    if (stored === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("finai_theme", next ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur-sm px-6">
      <div>
        <h1 className="text-lg font-bold leading-none">{title}</h1>
        {subtitle && (
          <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Search trigger (cosmetic) */}
        <button className="hidden sm:flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors w-48">
          <Search className="h-3.5 w-3.5 shrink-0" />
          <span className="text-xs">Search…</span>
          <kbd className="ml-auto hidden sm:inline-flex items-center rounded border border-border px-1.5 py-0.5 text-xs font-mono text-muted-foreground">
            ⌘K
          </kbd>
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          title="Toggle theme"
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notifications */}
        <button className="relative rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>

        {/* Avatar */}
        {user && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-600 text-white text-xs font-bold shadow-sm">
            {getInitials(user.full_name || user.email)}
          </div>
        )}
      </div>
    </header>
  );
}
