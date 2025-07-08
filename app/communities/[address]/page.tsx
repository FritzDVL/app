"use client";

import { useParams } from "next/navigation";
import { CommunityHeader } from "@/components/communities/community-header";
import { CommunitySidebar } from "@/components/communities/community-sidebar";
import { CommunityThreads } from "@/components/communities/community-threads";
import { ProtectedRoute } from "@/components/pages/protected-route";
import { BackNavigationLink } from "@/components/ui/back-navigation-link";

export default function CommunityPage() {
  const params = useParams();
  const communityAddress = params.address as string;

  return (
    <ProtectedRoute>
      <div className="mx-auto mt-4 max-w-7xl px-4">
        <BackNavigationLink href="/communities">Back to Communities</BackNavigationLink>
      </div>
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <CommunityHeader communityAddress={communityAddress} />
            <CommunityThreads communityAddress={communityAddress} />
          </div>
          {/* Sidebar */}
          <div className="space-y-8">
            <CommunitySidebar communityAddress={communityAddress} />
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
