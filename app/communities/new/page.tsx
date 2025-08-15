"use client";

import { useState } from "react";
import { CommunityCreateForm } from "@/components/communities/community-create-form";
import { CommunityCreationTips } from "@/components/communities/community-creation-tips";
import { CommunityRulesTips } from "@/components/communities/community-rules-tips";
import { ProtectedRoute } from "@/components/pages/protected-route";
import { BackNavigationLink } from "@/components/ui/back-navigation-link";
import { CommunityRule } from "@/lib/domain/communities/types";
import { useAuthStore } from "@/stores/auth-store";

export default function NewCommunityPage() {
  const [groupRule, setGroupRule] = useState<CommunityRule>({ type: "none" });

  const { account } = useAuthStore();

  return (
    <ProtectedRoute>
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Header with back button and title */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <BackNavigationLink href="/communities">Back to Communities</BackNavigationLink>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <CommunityCreateForm onGroupRuleChange={setGroupRule} creator={account ?? undefined} />
          </div>
          {/* Sidebar */}
          <div className="space-y-6">
            <CommunityCreationTips />
            {groupRule.type !== "none" && <CommunityRulesTips communityRule={groupRule} />}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
