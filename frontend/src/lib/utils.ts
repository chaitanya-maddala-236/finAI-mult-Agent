import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  value: number,
  currency = "INR",
  compact = false
): string {
  if (compact) {
    if (Math.abs(value) >= 1_00_00_000)
      return `₹${(value / 1_00_00_000).toFixed(2)}Cr`;
    if (Math.abs(value) >= 1_00_000)
      return `₹${(value / 1_00_000).toFixed(2)}L`;
    if (Math.abs(value) >= 1_000) return `₹${(value / 1_000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(value);
}

export function formatPercent(value: number, decimals = 2): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getRiskColor(level: string): string {
  switch (level?.toLowerCase()) {
    case "conservative":
      return "text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400";
    case "moderate":
      return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "aggressive":
      return "text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "text-gray-600 bg-gray-50 dark:bg-gray-900/30 dark:text-gray-400";
  }
}

export function getSentimentColor(sentiment: string): string {
  switch (sentiment?.toLowerCase()) {
    case "bullish":
      return "text-success";
    case "bearish":
      return "text-destructive";
    default:
      return "text-warning";
  }
}

export const ASSET_COLORS: Record<string, string> = {
  stock: "#4f46e5",
  etf: "#0891b2",
  mutual_fund: "#059669",
  gold: "#d97706",
  fixed_income: "#7c3aed",
  crypto: "#f59e0b",
  cash: "#6b7280",
};
