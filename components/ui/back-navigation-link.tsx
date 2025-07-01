// BackNavigationLink.tsx
import Link from "next/link";

export function BackNavigationLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center rounded-full bg-white/80 px-4 py-2 text-sm text-slate-600 backdrop-blur-sm hover:bg-white hover:text-slate-900"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="mr-2 h-4 w-4"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
      </svg>
      {children}
    </Link>
  );
}
