import React from "react";
import Link from "next/link";
import { MentionPopover } from "./mention-popover";

interface MentionProps {
  username: string;
  className?: string;
}

export function Mention({ username, className }: MentionProps) {
  const display = username.replace(/^@lens\//, "");

  return (
    <MentionPopover username={display}>
      <Link href={`/u/${display}`} className={className || "font-semibold text-brand-600 hover:underline"}>
        @{display}
      </Link>
    </MentionPopover>
  );
}

export default Mention;
