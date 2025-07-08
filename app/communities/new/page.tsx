"use client";

import { CommunityCreateForm } from "@/components/communities/community-create-form";
import { CommunityCreationTips } from "@/components/communities/community-creation-tips";
import { ProtectedRoute } from "@/components/pages/protected-route";
import { BackNavigationLink } from "@/components/ui/back-navigation-link";

export default function NewCommunityPage() {
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
            <CommunityCreateForm />
          </div>
          {/* Sidebar */}
          <div className="space-y-6">
            <CommunityCreationTips />
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
