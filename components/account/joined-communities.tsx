import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { groveLensUrlToHttp } from "@/lib/shared/utils";
import type { Community } from "@/types/common";
import { Users } from "lucide-react";

interface JoinedCommunitiesProps {
  communities: Community[];
  loading: boolean;
  lensAccount: { address?: string } | null;
}

export function JoinedCommunities({ communities, loading }: JoinedCommunitiesProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-500">Loading communities...</div>
      </div>
    );
  }
  if (communities.length > 0) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {communities.map(function (community) {
          return (
            <Link
              key={community.address}
              href={`/communities/${community.address}`}
              className="group flex flex-col rounded-2xl border bg-white p-5 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg dark:bg-gray-800"
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Image
                    src={groveLensUrlToHttp(community.logo ?? undefined) || "/logo.png"}
                    alt={community.name}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-xl object-cover"
                  />
                  <div className="ml-4 flex flex-col justify-center">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-bold text-foreground">{community.name}</h3>
                      <Badge className="bg-green-100 text-green-700">Member</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {(() => {
                        const words = community.description?.split(" ") || [];
                        if (words.length > 10) {
                          return words.slice(0, 10).join(" ") + "...";
                        }
                        return community.description;
                      })()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-4 text-xs text-muted-foreground">
                <span className="flex items-center">
                  <Users className="mr-1 h-4 w-4" />
                  {community.memberCount || 0} members
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Users className="mb-4 h-12 w-12 text-slate-300" />
      <h3 className="mb-2 text-lg font-medium text-foreground">No joined communities</h3>
      <p className="text-muted-foreground">Communities you join will appear here</p>
    </div>
  );
}
