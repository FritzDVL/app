import Image from "next/image";
import Link from "next/link";
import { CommunityRuleMessage } from "@/components/communities/rules/community-rule-message";
import { Card, CardContent } from "@/components/ui/card";
import { Community } from "@/lib/domain/communities/types";
import { groveLensUrlToHttp } from "@/lib/shared/utils";
import { GroupRuleType } from "@lens-protocol/client";
import { MessageSquare, Users } from "lucide-react";

interface CommunityCardProps {
  community: Community;
}

export function CommunityCard({ community }: CommunityCardProps) {
  const ruleType = community.group.rules?.required?.[0]?.type;
  return (
    <Link key={community.id} href={`/communities/${community.group.address}`} className="group">
      <Card className="group w-full min-w-0 cursor-pointer rounded-2xl border bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg dark:bg-gray-800 sm:p-6">
        <CardContent className="p-6">
          <div className="mb-4 flex items-start justify-between">
            {community.group.metadata?.icon ? (
              <Image
                src={groveLensUrlToHttp(community.group.metadata.icon)}
                alt={community.name}
                width={64}
                height={64}
                className="h-12 w-12 rounded-full border border-slate-200 bg-white object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-lg font-semibold text-white">
                {community.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <h3 className="mb-2 flex items-center text-lg font-semibold text-foreground transition-colors group-hover:text-brand-600">
            {community.name}
          </h3>
          <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{community.group.metadata?.description}</p>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{community.memberCount.toLocaleString()}</span>
              {ruleType && ruleType !== "none" && <CommunityRuleMessage ruleType={ruleType as GroupRuleType} />}
            </div>
          </div>
          {community.postCount !== undefined && (
            <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
              <MessageSquare className="h-3 w-3" />
              <span>{community.postCount.toLocaleString()} posts</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
