import React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AvatarProfileLinkProps {
  author?: any; // Accepts an author object (Account type)
}

export const AvatarProfileLink: React.FC<AvatarProfileLinkProps> = ({ author }) => {
  // Prefer explicit props, fallback to author fields if present
  const resolvedUsername = author?.username?.localName;
  const resolvedProfileUrl = resolvedUsername ? `/u/${resolvedUsername}` : "#";
  const resolvedAvatarUrl = author?.metadata?.picture || undefined;
  const resolvedName = author?.metadata?.name || author?.username?.localName;

  return (
    <Link
      href={resolvedProfileUrl}
      onClick={e => {
        e.stopPropagation();
      }}
      tabIndex={0}
      aria-label={`Go to @${resolvedUsername} profile`}
    >
      <Avatar className="h-12 w-12 ring-2 ring-gray-200 transition-all duration-300 group-hover:ring-brand-300 dark:ring-gray-700">
        <AvatarImage src={resolvedAvatarUrl} />
        <AvatarFallback className="bg-gradient-to-br from-brand-400 to-brand-600 text-sm font-semibold text-white">
          {resolvedName?.[0]?.toUpperCase() || resolvedUsername?.[0]?.toUpperCase() || "?"}
        </AvatarFallback>
      </Avatar>
    </Link>
  );
};
