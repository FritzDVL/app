import { ReactNode } from "react";
import Image from "next/image";

interface CommunityMemberCardProps {
  avatarUrl: string;
  name: string;
  username: string;
  actionButton: ReactNode;
  meta?: ReactNode;
}

export function CommunityMemberCard({ avatarUrl, name, username, actionButton, meta }: CommunityMemberCardProps) {
  return (
    <li className="flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <Image
        src={avatarUrl}
        alt={username}
        className="h-12 w-12 rounded-full border border-gray-200 object-cover dark:border-gray-700"
        width={48}
        height={48}
      />
      <div className="min-w-0 flex-1 pl-4 pr-8">
        <div className="flex flex-col">
          <span className="truncate text-base font-semibold text-foreground">{name}</span>
          <span className="truncate text-xs text-muted-foreground">@{username}</span>
        </div>
        {meta && (
          <div className="mt-1 flex flex-row items-center gap-1 whitespace-nowrap text-xs text-muted-foreground">
            {meta}
          </div>
        )}
      </div>
      <div className="flex items-center self-stretch pl-4">{actionButton}</div>
    </li>
  );
}
