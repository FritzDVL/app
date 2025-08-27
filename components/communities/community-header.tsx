import Image from "next/image";
import { CommunityHeaderActions } from "@/components/communities/community-header-actions";
import { Card, CardContent } from "@/components/ui/card";
import { Community } from "@/lib/domain/communities/types";
import { groveLensUrlToHttp } from "@/lib/shared/utils";
import { GroupRuleType } from "@lens-protocol/client";
import { DollarSign, KeyRound, MessageCircle, ShieldCheck, Users } from "lucide-react";

export function CommunityHeader({ community }: { community: Community }) {
  if (!community) return null;

  return (
    <>
      <Card className="mb-8 rounded-3xl bg-white backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col items-center space-y-4 md:flex-row md:items-start md:space-x-6 md:space-y-0">
            {/* Logo */}
            <div className="flex h-[80px] w-[80px] items-center justify-center md:mr-6 md:h-[100px] md:w-[100px]">
              {community.logo ? (
                <Image
                  src={groveLensUrlToHttp(community.logo)}
                  alt={community.name}
                  width={100}
                  height={100}
                  className="h-[80px] w-[80px] rounded-full border border-slate-200 bg-white object-cover md:h-[100px] md:w-[100px]"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-2xl text-foreground md:h-[100px] md:w-[100px]">
                  {community.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            {/* Main content: name, desc, stats + actions */}
            <div className="flex w-full min-w-0 flex-1 flex-col">
              <div className="flex w-full flex-col md:flex-row md:items-start md:justify-between">
                {/* Name, desc, stats */}
                <div className="w-full min-w-0 flex-1 text-center md:text-left">
                  <h1 className="mb-2 truncate text-2xl font-bold text-foreground md:text-3xl">{community.name}</h1>
                  <p className="mx-auto mb-4 max-w-2xl whitespace-pre-line break-words text-muted-foreground md:mx-0">
                    {community.description}
                  </p>
                  <div className="flex flex-col items-center space-y-2 text-sm text-muted-foreground md:flex-row md:space-x-6 md:space-y-0">
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      {community.memberCount.toLocaleString()} members
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      {community.threadsCount} threads
                    </div>
                    {/* Community Rule Message */}
                    {Boolean(
                      community.rules?.required?.[0]?.type && community.rules?.required?.[0]?.type !== "none",
                    ) && (
                      <div className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-gray-700 dark:text-slate-200">
                        {(() => {
                          const ruleType = community.rules?.required?.[0]?.type;
                          switch (ruleType) {
                            case GroupRuleType.SimplePayment:
                              return (
                                <>
                                  <DollarSign className="mr-1 h-4 w-4 text-yellow-500" />
                                  Payment required
                                </>
                              );
                            case GroupRuleType.TokenGated:
                              return (
                                <>
                                  <KeyRound className="mr-1 h-4 w-4 text-indigo-500" />
                                  Token required
                                </>
                              );
                            case GroupRuleType.MembershipApproval:
                              return (
                                <>
                                  <ShieldCheck className="mr-1 h-4 w-4 text-rose-500" />
                                  Approval required
                                </>
                              );
                            default:
                              return null;
                          }
                        })()}
                      </div>
                    )}
                  </div>
                </div>
                {/* Actions: desktop only, right-aligned */}
                <div className="hidden md:ml-8 md:flex md:items-start md:justify-end">
                  <CommunityHeaderActions community={community} />
                </div>
              </div>
              {/* Actions: mobile only, full width below */}
              <div className="mt-4 flex w-full justify-center md:hidden">
                <CommunityHeaderActions community={community} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
