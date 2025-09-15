"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProtectedRoute } from "@/components/pages/protected-route";
import { RulesGuidelines } from "@/components/shared/rules-guidelines";
import { ThreadCreateForm } from "@/components/thread/thread-create-form";
import { BackNavigationLink } from "@/components/ui/back-navigation-link";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Community } from "@/lib/domain/communities/types";
import { getCommunity } from "@/lib/services/community/get-community";
import { useAuthStore } from "@/stores/auth-store";
import { Address } from "@/types/common";

export default function NewThreadPage() {
  const params = useParams();
  const communityAddress = params.address as string;

  const [isHydrated, setIsHydrated] = useState(false);
  const [community, setCommunity] = useState<Community | null>(null);

  useEffect(() => {
    if (useAuthStore.persist?.hasHydrated()) {
      setIsHydrated(true);
    } else {
      const unsub = useAuthStore.persist?.onHydrate?.(() => setIsHydrated(true));
      return () => unsub && unsub();
    }
  }, []);

  useEffect(() => {
    async function fetchCommunity() {
      const result = await getCommunity(communityAddress as Address);
      if (result.success && result.community) {
        setCommunity(result.community);
      }
    }
    if (isHydrated) {
      fetchCommunity();
    }
  }, [isHydrated, communityAddress]);

  if (!isHydrated || !community) {
    return <LoadingSpinner text="Loading thread form..." />;
  }
  return (
    <ProtectedRoute>
      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center">
          <BackNavigationLink href={`/communities/${community.group.address}`}>Back to Community</BackNavigationLink>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <ThreadCreateForm community={community} />
          </div>
          {/* Sidebar */}
          <div className="space-y-6">
            <RulesGuidelines variant="posting" />
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
