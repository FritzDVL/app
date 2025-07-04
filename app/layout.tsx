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
          <footer className="mt-12 flex flex-col items-center gap-2 pb-6 pt-8 text-xs text-slate-500">
            <span>
              Made with <span className="text-pink-500">&lt;3</span> by{" "}
              <a
                href="https://x.com/meketom"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand-700 hover:underline"
              >
                @meketom
              </a>
            </span>
            <div className="flex gap-4">
              <a
                href="https://github.com/meketom"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="transition-colors hover:text-brand-600"
              >
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.686-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.699 1.028 1.593 1.028 2.686 0 3.847-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.417-.012 2.747 0 .267.18.577.688.48C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2Z" />
                </svg>
              </a>
              <a
                href="https://hey.com/meketom"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Hey"
                className="transition-colors hover:text-brand-600"
              >
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.001 2.002c-5.523 0-10 4.477-10 10 0 5.522 4.477 9.999 10 9.999s10-4.477 10-9.999c0-5.523-4.477-10-10-10zm0 18.181c-4.519 0-8.181-3.662-8.181-8.181 0-4.519 3.662-8.181 8.181-8.181 4.519 0 8.181 3.662 8.181 8.181 0 4.519-3.662 8.181-8.181 8.181zm-2.727-7.272c0-.753.611-1.364 1.364-1.364.753 0 1.364.611 1.364 1.364s-.611 1.364-1.364 1.364c-.753 0-1.364-.611-1.364-1.364zm5.454 0c0-.753.611-1.364 1.364-1.364.753 0 1.364.611 1.364 1.364s-.611 1.364-1.364 1.364c-.753 0-1.364-.611-1.364-1.364zm-2.727 2.727c0-.753.611-1.364 1.364-1.364.753 0 1.364.611 1.364 1.364s-.611 1.364-1.364 1.364c-.753 0-1.364-.611-1.364-1.364z" />
                </svg>
              </a>
              <a
                href="https://x.com/meketom"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="transition-colors hover:text-brand-600"
              >
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.53 2.47a2.5 2.5 0 0 1 3.535 3.535l-4.25 4.25 4.25 4.25a2.5 2.5 0 0 1-3.535 3.535l-4.25-4.25-4.25 4.25a2.5 2.5 0 0 1-3.535-3.535l4.25-4.25-4.25-4.25A2.5 2.5 0 0 1 6.47 2.47l4.25 4.25 4.25-4.25z" />
                </svg>
              </a>
            </div>
          </footer>
          <Toaster />
        </Web3Provider>
      </body>
    </html>
  );
}
