"use client";

import { useEffect, useState } from "react";
import { CommunitySettingsClient } from "@/components/communities/settings/community-settings-client";
import { BackNavigationLink } from "@/components/ui/back-navigation-link";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getCommunity } from "@/lib/services/community/get-community";

export default function CommunitySettingsPage({ params }: { params: { address: string } }) {
  const communityAddress = params.address;
  const [community, setCommunity] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const communityResult = await getCommunity(communityAddress);
        if (communityResult.success) {
          setCommunity(communityResult.community);
        } else {
          setCommunity(null);
        }
      } catch {
        setError("Error loading community");
        setCommunity(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [communityAddress]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <LoadingSpinner text="Loading community..." />
      </div>
    );
  }
  if (error || !community) {
    return <div className="text-center text-red-500">Community not found</div>;
  }

  return (
    <>
      <div className="mx-auto mt-4 max-w-7xl px-4">
        <BackNavigationLink href={`/communities/${communityAddress}`}>Back to Community</BackNavigationLink>
      </div>
      <main className="mx-auto max-w-7xl px-4 py-8">
        <CommunitySettingsClient community={community} />
      </main>
    </>
  );
}
