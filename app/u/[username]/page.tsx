"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { ProtectedRoute } from "@/components/protected-route";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { client } from "@/lib/clients/lens-protocol-mainnet";
import { fetchCommunitiesJoined } from "@/lib/fetchers/communities";
import { fetchLatestRepliesByAuthor } from "@/lib/fetchers/replies";
import { useAuthStore } from "@/stores/auth-store";
import { Community } from "@/types/common";
import { Account } from "@lens-protocol/client";
import { fetchAccount, fetchAccountStats } from "@lens-protocol/client/actions";
import { evmAddress } from "@lens-protocol/react";
import { useQuery } from "@tanstack/react-query";
import { ArrowUp, Calendar, LinkIcon, MapPin, MessageCircle, Users } from "lucide-react";

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
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-green-100/40">
        <Navbar />
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
      </div>
    );
  }

  if (!lensAccount && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-green-100/40">
        <Navbar />
        <div className="mx-auto max-w-6xl px-4 py-8 text-center">
          <Card className="mx-auto max-w-md rounded-3xl border border-slate-300/60 bg-white/70 backdrop-blur-sm">
            <CardContent className="p-8">
              <h1 className="mb-4 text-2xl font-bold text-slate-900">Profile not found</h1>
              <p className="text-slate-700">The user @{username} could not be found or is not connected to Lens.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-green-100/40">
        <Navbar />

        <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
          {/* Profile Header */}
          <div className="relative">
            {/* Cover Image */}
            <div className="relative h-48 overflow-hidden rounded-3xl md:h-64">
              {lensAccount?.metadata?.coverPicture ? (
                <>
                  <Image
                    src={lensAccount.metadata.coverPicture}
                    alt="Cover"
                    className="h-full w-full object-cover"
                    width={300}
                    height={100}
                  />
                  <div className="absolute inset-0 bg-green-900/20"></div>
                </>
              ) : (
                <>
                  <div className="h-full w-full bg-gradient-to-r from-green-600 via-green-500 to-green-400"></div>
                  <div className="absolute inset-0 bg-black/20"></div>
                </>
              )}
            </div>

            {/* Profile Info */}
            <div className="relative -mt-20 px-6">
              <div className="flex flex-col items-start space-y-4 md:flex-row md:items-end md:space-x-6 md:space-y-0">
                <Avatar className="h-32 w-32 border-4 border-white ring-2 ring-green-100">
                  <AvatarImage src={lensAccount?.metadata?.picture || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-r from-green-400 to-green-600 text-4xl text-white">
                    {(lensAccount?.metadata?.name || lensAccount?.username?.localName || username)[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 rounded-3xl border border-slate-300/60 bg-white/70 p-6 backdrop-blur-sm">
                  <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <div className="mb-2 flex items-center space-x-3">
                        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
                          {lensAccount?.metadata?.name || lensAccount?.username?.localName || username}
                        </h1>
                        {/* <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                        Level {profileData.level}
                      </Badge> */}
                      </div>
                      <p className="mb-2 font-medium text-green-600">@{lensAccount?.username?.localName || username}</p>
                      <p className="max-w-2xl text-slate-700">{lensAccount?.metadata?.bio || "No bio available"}</p>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="mt-4 flex items-center space-x-6 border-t border-slate-200/60 pt-4">
                    <div className="flex items-center text-sm text-slate-600">
                      <Calendar className="mr-1 h-4 w-4" />
                      Joined{" "}
                      {lensAccount?.createdAt
                        ? new Date(lensAccount.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                          })
                        : "Unknown date"}
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <MapPin className="mr-1 h-4 w-4" />
                      {lensAccount?.metadata?.attributes?.find(attr => attr.key === "location" || attr.key === "city")
                        ?.value || "Location not set"}
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <LinkIcon className="mr-1 h-4 w-4" />
                      <a
                        href={
                          lensAccount?.metadata?.attributes?.find(attr => attr.key === "website" || attr.key === "url")
                            ?.value || "#"
                        }
                        className="text-green-600 hover:text-green-700 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {lensAccount?.metadata?.attributes?.find(attr => attr.key === "website" || attr.key === "url")
                          ?.value || "No website"}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card className="rounded-3xl border border-slate-300/60 bg-white/70 text-center backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{followers}</div>
                <div className="text-sm text-slate-700">Followers</div>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border border-slate-300/60 bg-white/70 text-center backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{following}</div>
                <div className="text-sm text-slate-700">Following</div>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border border-slate-300/60 bg-white/70 text-center backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{statsLoading ? "..." : posts}</div>
                <div className="text-sm text-slate-700">Posts</div>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border border-slate-300/60 bg-white/70 text-center backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{lensAccount?.score || 0}</div>
                <div className="text-sm text-slate-700">Reputation</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Minimalist Tab Navigation */}
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-1 rounded-2xl bg-slate-100/80 p-1">
                <button
                  onClick={() => setActiveTab("recent")}
                  className={`rounded-xl px-6 py-3 text-sm font-medium transition-all ${
                    activeTab === "recent" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Recent Activity
                </button>
                <button
                  onClick={() => setActiveTab("forums")}
                  className={`rounded-xl px-6 py-3 text-sm font-medium transition-all ${
                    activeTab === "forums" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Communities
                </button>
              </div>
            </div>

            {/* Content Sections */}
            {activeTab === "recent" && (
              <div className="space-y-4">
                {loadingReplies ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-slate-500">Loading recent activity...</div>
                  </div>
                ) : userReplies.length > 0 ? (
                  <div className="space-y-3">
                    {userReplies.map((reply: any) => (
                      <div
                        key={reply.id}
                        className="group relative rounded-2xl border border-slate-200/60 bg-white/60 p-5 backdrop-blur-sm"
                      >
                        <div className="space-y-3">
                          {/* Reply Content */}
                          <div className="prose prose-sm max-w-none text-slate-700">
                            <div dangerouslySetInnerHTML={{ __html: reply.content }} />
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-4 text-slate-500">
                              <span className="flex items-center space-x-1">
                                <ArrowUp className="h-4 w-4 text-green-500" />
                                <span>{reply.upvotes || 0}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <ArrowUp className="h-4 w-4 rotate-180 text-red-400" />
                                <span>{reply.downvotes || 0}</span>
                              </span>
                              <span className="text-slate-400">
                                {reply.createdAt ? new Date(reply.createdAt).toLocaleDateString() : ""}
                              </span>
                            </div>
                            {reply.thread && (
                              <Link
                                href={`/thread/${reply.thread}`}
                                className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100"
                              >
                                View Thread
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <MessageCircle className="mb-4 h-12 w-12 text-slate-300" />
                    <h3 className="mb-2 text-lg font-medium text-slate-900">No recent activity</h3>
                    <p className="text-slate-500">Posts and replies will appear here</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "forums" && (
              <div className="space-y-4">
                {loadingCommunities ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-slate-500">Loading communities...</div>
                  </div>
                ) : joinedCommunities.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {joinedCommunities.map((community: Community) => (
                      <Link
                        key={community.id}
                        href={`/communities/${community.address}`}
                        className="group rounded-2xl border border-slate-200/60 bg-white/60 p-5 backdrop-blur-sm hover:bg-white/80"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            {community.logo ? (
                              <Image
                                src={community.logo.replace("lens://", "https://api.grove.storage/")}
                                alt={community.name}
                                width={40}
                                height={40}
                                className="rounded-xl"
                              />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-green-600 text-lg font-bold text-white">
                                {community.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-slate-900 group-hover:text-green-600">
                              {community.name}
                            </h3>
                            <div className="mt-1 flex items-center space-x-3 text-sm text-slate-500">
                              <span className="flex items-center space-x-1">
                                <Users className="h-4 w-4" />
                                <span>{community.memberCount.toLocaleString()}</span>
                              </span>
                              {community.moderators?.some(
                                m => m.address.toLowerCase() === lensAccount?.address?.toLowerCase(),
                              ) && <Badge className="bg-green-100 text-xs text-green-700">Moderator</Badge>}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Users className="mb-4 h-12 w-12 text-slate-300" />
                    <h3 className="mb-2 text-lg font-medium text-slate-900">No communities yet</h3>
                    <p className="text-slate-500">Join communities to see them here</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
