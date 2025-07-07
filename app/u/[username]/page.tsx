"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { JoinedCommunities } from "@/components/account/joined-communities";
import { ProfileHeader } from "@/components/account/profile-header";
import { ProfileStats } from "@/components/account/profile-stats";
import { ProfileTabs } from "@/components/account/profile-tabs";
import { RecentActivity } from "@/components/account/recent-activity";
import { ProtectedRoute } from "@/components/pages/protected-route";
import { Card, CardContent } from "@/components/ui/card";
import { client } from "@/lib/clients/lens-protocol-mainnet";
import { fetchCommunitiesJoined } from "@/lib/fetchers/communities";
import { fetchLatestRepliesByAuthor } from "@/lib/fetchers/replies";
import { useAuthStore } from "@/stores/auth-store";
import { Account } from "@lens-protocol/client";
import { fetchAccount, fetchAccountStats } from "@lens-protocol/client/actions";
import { evmAddress } from "@lens-protocol/react";
import { useQuery } from "@tanstack/react-query";

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [activeTab, setActiveTab] = useState("recent");
  const [isLoading, setIsLoading] = useState(true);
  const [lensAccount, setLensAccount] = useState<Account | null>(null);

  // Stats state
  const [followers, setFollowers] = useState<number>(0);
  const [following, setFollowing] = useState<number>(0);
  const [posts, setPosts] = useState<number>(0);
  const [statsLoading, setStatsLoading] = useState(false);

  const { account } = useAuthStore();
  const isOwnProfile = account?.username?.localName === username;

  const { data: userReplies = [], isLoading: loadingReplies } = useQuery({
    queryKey: ["latestReplies", lensAccount?.address],
    queryFn: async () => {
      if (!lensAccount?.address) return [];
      return fetchLatestRepliesByAuthor(lensAccount.address, 10);
    },
    enabled: !!lensAccount?.address,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const { data: joinedCommunities = [], isLoading: loadingCommunities } = useQuery({
    queryKey: ["joinedCommunities", lensAccount?.address],
    queryFn: async () => {
      if (!lensAccount?.address) return [];
      return fetchCommunitiesJoined(lensAccount.address);
    },
    enabled: !!lensAccount?.address,
    staleTime: 1000 * 60 * 2,
  });

  useEffect(() => {
    const loadProfileData = async () => {
      setIsLoading(true);

      if (isOwnProfile && account) {
        // Use the current user's account directly
        setLensAccount(account);

        // Fetch account stats
        await fetchStats(account.address);
      } else {
        // For other users, fetch their account data from Lens API
        try {
          const accountResult = await fetchAccount(client, {
            username: {
              localName: username,
            },
          });

          if (accountResult.isOk() && accountResult.value) {
            setLensAccount(accountResult.value);
            // Fetch account stats for the fetched account
            await fetchStats(accountResult.value.address);
          } else {
            setLensAccount(null);
          }
        } catch (error) {
          console.error("Error fetching Lens account:", error);
          setLensAccount(null);
        }
      }

      setIsLoading(false);
    };

    loadProfileData();
  }, [username, account, isOwnProfile]);

  const fetchStats = async (address: string) => {
    setStatsLoading(true);
    try {
      // Fetch account stats for posts and other data
      const statsResult = await fetchAccountStats(client, {
        account: evmAddress(address),
      });

      if (statsResult.isOk() && statsResult.value) {
        const stats = statsResult.value;

        // Update posts from the API response
        const postsCount = stats.feedStats?.posts || 0;
        const followersCount = stats.graphFollowStats?.followers || 0;
        const followingCount = stats.graphFollowStats?.following || 0;

        setPosts(postsCount);
        setFollowers(followersCount);
        setFollowing(followingCount);
      }
    } catch (error) {
      // Set default values on error
      console.error("Error fetching account stats:", error);
      setPosts(0);
    } finally {
      setStatsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-64 rounded-3xl bg-white/60 backdrop-blur-sm"></div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 rounded-3xl bg-white/60 backdrop-blur-sm"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!lensAccount && !isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 text-center">
        <Card className="mx-auto max-w-md rounded-3xl border border-slate-300/60 bg-white/70 backdrop-blur-sm">
          <CardContent className="p-8">
            <h1 className="mb-4 text-2xl font-bold text-slate-900">Profile not found</h1>
            <p className="text-slate-700">The user @{username} could not be found or is not connected to Lens.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
        {/* Profile Header */}
        <ProfileHeader lensAccount={lensAccount as Account} username={username} />

        {/* Stats Cards */}
        <ProfileStats
          followers={followers}
          following={following}
          posts={posts}
          reputation={lensAccount?.score || 0}
          loading={statsLoading}
        />

        {/* Main Content */}
        <div className="space-y-8">
          {/* Minimalist Tab Navigation */}
          <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Content Sections */}
          {activeTab === "recent" && <RecentActivity loading={loadingReplies} replies={userReplies} />}

          {activeTab === "forums" && (
            <JoinedCommunities loading={loadingCommunities} communities={joinedCommunities} lensAccount={lensAccount} />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
