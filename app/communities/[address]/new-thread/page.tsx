"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CommunityRules } from "@/components/communities/community-rules";
import { ProtectedRoute } from "@/components/pages/protected-route";
import { NewThreadForm } from "@/components/thread/new-thread-form";
import { BackNavigationLink } from "@/components/ui/back-navigation-link";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuthStore } from "@/stores/auth-store";

export default function NewThreadPage() {
  const params = useParams();
  const communityAddress = params.address as string;
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (useAuthStore.persist?.hasHydrated()) {
      setIsHydrated(true);
    } else {
      const unsub = useAuthStore.persist?.onHydrate?.(() => setIsHydrated(true));
      return () => unsub && unsub();
    }
  }, []);

  if (!isHydrated) {
    return <LoadingSpinner text="Loading thread form..." />;
  }
  return (
    <ProtectedRoute>
      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center">
          <BackNavigationLink href={`/communities/${communityAddress}`}>Back to Community</BackNavigationLink>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <NewThreadForm communityAddress={communityAddress} />
          </div>
          {/* Sidebar */}
          <div className="space-y-6">
            <CommunityRules variant="posting" />
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
