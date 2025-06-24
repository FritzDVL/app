import type React from "react";
import localFont from "next/font/local";
import "./globals.css";
import { AppProvider } from "@/components/providers/app-provider";
import { Web3Provider } from "@/components/providers/web3-provider";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";

const customFont = localFont({
  src: "../public/3534416bbfdcc9be-s.p.woff2",
  variable: "--font-custom",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LensForum - Decentralized Communities",
  description: "Join the future of community discussions on Lens Protocol",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${customFont.variable} font-custom`} suppressHydrationWarning>
        <Web3Provider>
          <div className="fixed bottom-4 right-4 z-50"></div>
          <AppProvider>{children}</AppProvider>
          <Toaster />
        </Web3Provider>
      </body>
    </html>
  );
}
