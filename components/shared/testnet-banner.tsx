import React from "react";

export function TestnetBanner() {
  return (
    <div className="mb-2 w-full rounded-lg border border-yellow-300 bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-50 px-4 py-2 text-center text-sm font-semibold text-yellow-900 shadow-sm">
      <span className="mr-2 animate-pulse">⚠️</span>
      <span>
        <b>LensForum Testnet:</b> This is a{" "}
        <span className="underline decoration-yellow-500 decoration-wavy">testing environment</span>.
        <br className="hidden sm:inline" />
        All data, posts, and accounts may be
        <span className="font-bold text-yellow-700"> reset or deleted </span>
        at any time. Enjoy exploring, but don&apos;t get too attached!
      </span>
    </div>
  );
}
