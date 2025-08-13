import React from "react";
import Link from "next/link";

interface NotificationCardProps {
  href: string;
  children: React.ReactNode;
}

export function NotificationCard({ href, children }: NotificationCardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-xl border border-gray-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-brand-400/30 hover:bg-brand-50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-brand-500/40 dark:hover:bg-brand-900/20"
    >
      {children}
    </Link>
  );
}
