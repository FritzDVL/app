import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
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
              className="group flex flex-col rounded-2xl border border-slate-200/60 bg-white/60 p-5 backdrop-blur-sm transition-shadow hover:shadow-lg"
            >
              <div className="flex items-center space-x-4">
                <Image
                  src={community.logo || "/logo.png"}
                  alt={community.name}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-green-700">{community.name}</h3>
                    <Badge className="bg-green-100 text-green-700">Member</Badge>
                  </div>
                  <div className="text-sm text-slate-600">{community.description}</div>
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-4 text-xs text-slate-500">
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
      <h3 className="mb-2 text-lg font-medium text-slate-900">No joined communities</h3>
      <p className="text-slate-500">Communities you join will appear here</p>
    </div>
  );
}
