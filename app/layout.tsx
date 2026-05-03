import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { AuthButtons } from "./components/AuthButtons";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vault TCG",
  description: "Your TCG collection vault",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body suppressHydrationWarning>
          <div className="min-h-screen flex flex-col">
            <header className="flex items-center justify-between px-6 py-3 border-b border-black/[.08] dark:border-white/[.1] bg-white dark:bg-zinc-950">
              <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Vault TCG
              </span>
              <div className="flex items-center gap-3">
                <AuthButtons />
              </div>
            </header>
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
