import { config } from "@/config";
import { cookieToInitialState } from "@account-kit/core";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { Providers } from "./providers";
import type { Metadata } from "next";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

// Metadata moved to a separate file to avoid conflicts with "use client"

export const metadata: Metadata = {
  title: "Vibe AI",
  description: "Web3 Community Intelligence Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
