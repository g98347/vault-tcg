import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { AuthButtons } from "./components/AuthButtons";
import { BabyIcon } from "./components/BabyIcon";
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
            {/* Hero banner */}
            <div className="w-full bg-gradient-to-r from-[#1a0a2e] via-[#2d1054] to-[#1a0a2e] border-b border-purple-900/60 py-6 px-4 flex items-center justify-center gap-4">
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-purple-100 drop-shadow-lg select-none"
                style={{ textShadow: "0 0 24px #9b59b680" }}>
                Lucy&apos;s
              </span>
              <BabyIcon size={90} />
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-purple-100 drop-shadow-lg select-none"
                style={{ textShadow: "0 0 24px #9b59b680" }}>
                Barcodes
              </span>
            </div>

            <header className="flex items-center justify-between px-6 py-3 border-b border-white/[.06] bg-zinc-950">
              <span className="text-xs font-semibold tracking-widest uppercase text-zinc-500">
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
