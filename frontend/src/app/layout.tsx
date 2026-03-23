import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "FinAI – Multi-Agent Financial Intelligence",
    template: "%s | FinAI",
  },
  description:
    "AI-powered personal finance advisor with multi-agent intelligence. Get personalised portfolio analysis, market insights, and investment advice.",
  keywords: [
    "finance",
    "AI",
    "investment",
    "portfolio",
    "LangGraph",
    "financial advisor",
  ],
  authors: [{ name: "FinAI Team" }],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
