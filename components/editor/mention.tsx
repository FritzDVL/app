import React from "react";
import Link from "next/link";

interface MentionProps {
  username: string;
  className?: string;
}

export function Mention({ username, className }: MentionProps) {
  const display = username.replace(/^@lens\//, "");
  return (
    <Link href={`/u/${display}`} className={className || "font-semibold text-brand-600 hover:underline"}>
      @{display}
    </Link>
  );
}

export default Mention;
