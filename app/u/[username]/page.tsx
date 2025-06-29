"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      return fetchCommunitiesJoined(lensAccount.address, 10);
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
      <div className="min-h-screen bg-gradient-to-br from-brand-50/30 via-brand-50 to-brand-100/30">
        <Navbar />
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-64 rounded-3xl bg-gray-200"></div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 rounded-lg bg-gray-200"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!lensAccount && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50/30 via-brand-50 to-brand-100/30">
        <Navbar />
        <div className="mx-auto max-w-6xl px-4 py-8 text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">Profile not found</h1>
          <p className="text-gray-600">The user @{username} could not be found or is not connected to Lens.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50/30 via-brand-50 to-brand-100/30">
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
                <div className="absolute inset-0 bg-black/20"></div>
              </>
            ) : (
              <>
                <div className="h-full w-full bg-gradient-to-r from-brand-600 via-brand-500 to-brand-400"></div>
                <div className="absolute inset-0 bg-black/20"></div>
              </>
            )}
          </div>

          {/* Profile Info */}
          <div className="relative -mt-20 px-6">
            <div className="flex flex-col items-start space-y-4 md:flex-row md:items-end md:space-x-6 md:space-y-0">
              <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
                <AvatarImage src={lensAccount?.metadata?.picture || "/placeholder.svg"} />
                <AvatarFallback className="bg-gradient-to-r from-brand-400 to-brand-600 text-4xl text-white">
                  {(lensAccount?.metadata?.name || lensAccount?.username?.localName || username)[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="gradient-card flex-1 rounded-2xl border border-brand-200/50 p-6 shadow-xl">
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <div className="mb-2 flex items-center space-x-3">
                      <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                        {lensAccount?.metadata?.name || lensAccount?.username?.localName || username}
                      </h1>
                      {/* <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                        Level {profileData.level}
                      </Badge> */}
                    </div>
                    <p className="mb-2 font-medium text-brand-600">@{lensAccount?.username?.localName || username}</p>
                    <p className="max-w-2xl text-gray-600">{lensAccount?.metadata?.bio || "No bio available"}</p>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="mt-4 flex items-center space-x-6 border-t border-brand-200/50 pt-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="mr-1 h-4 w-4" />
                    Joined{" "}
                    {lensAccount?.createdAt
                      ? new Date(lensAccount.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                        })
                      : "Unknown date"}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="mr-1 h-4 w-4" />
                    {lensAccount?.metadata?.attributes?.find(attr => attr.key === "location" || attr.key === "city")
                      ?.value || "Location not set"}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <LinkIcon className="mr-1 h-4 w-4" />
                    <a
                      href={
                        lensAccount?.metadata?.attributes?.find(attr => attr.key === "website" || attr.key === "url")
                          ?.value || "#"
                      }
                      className="text-brand-600 hover:underline"
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
          <Card className="gradient-card border border-brand-200/50 text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-brand-600">{followers}</div>
              <div className="text-sm text-gray-600">Followers</div>
            </CardContent>
          </Card>
          <Card className="gradient-card border border-brand-200/50 text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-brand-600">{following}</div>
              <div className="text-sm text-gray-600">Following</div>
            </CardContent>
          </Card>
          <Card className="gradient-card border border-brand-200/50 text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-brand-600">{statsLoading ? "..." : posts}</div>
              <div className="text-sm text-gray-600">Posts</div>
            </CardContent>
          </Card>
          <Card className="gradient-card border border-brand-200/50 text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-brand-600">{lensAccount?.score || 0}</div>
              <div className="text-sm text-gray-600">Reputation</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="gradient-card grid w-full grid-cols-2 rounded-full border border-brand-200/50 p-1">
            <TabsTrigger value="recent" className="rounded-full">
              Recent replies
            </TabsTrigger>
            <TabsTrigger value="forums" className="rounded-full">
              Communities
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="space-y-4">
            {/* Latest Replies */}
            {loadingReplies ? (
              <div className="py-8 text-center text-gray-500">Loading latest posts...</div>
            ) : userReplies.length > 0 ? (
              userReplies.map((reply: any) => (
                <Card
                  key={reply.id}
                  className="rounded-xl border border-brand-100/60 bg-white shadow-md transition-shadow hover:shadow-lg"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex w-full items-start justify-between">
                        {/* Reply content */}
                        <div className="prose prose-sm max-w-none rounded-lg px-4 py-2 text-gray-800">
                          <div dangerouslySetInnerHTML={{ __html: reply.content }} />
                        </div>
                        {reply.thread && (
                          <Link
                            href={`/thread/${reply.thread}`}
                            className="group inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 shadow-sm ring-1 ring-inset ring-brand-100 transition hover:bg-brand-100 hover:text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-400"
                            aria-label="View Thread"
                          >
                            <MessageCircle className="h-5 w-5 text-brand-400 transition group-hover:text-brand-600" />
                            View Thread
                            <ArrowUp className="ml-1 h-4 w-4 -rotate-90 text-brand-300 transition group-hover:text-brand-600" />
                          </Link>
                        )}
                      </div>

                      {/* Actions row */}
                      <div className="mt-3 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-brand-600">
                            <ArrowUp className="h-4 w-4" />
                            <span className="font-semibold">{reply.upvotes || 0}</span>
                          </div>
                          <div className="flex items-center gap-1 text-red-400">
                            <ArrowUp className="h-4 w-4 rotate-180" />
                            <span className="font-semibold">{reply.downvotes || 0}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-500">
                            <MessageCircle className="h-4 w-4" />
                            <span>{0}</span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">
                          {reply.createdAt ? new Date(reply.createdAt).toLocaleString() : ""}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="py-8 text-center text-gray-500">No posts yet</div>
            )}
          </TabsContent>

          <TabsContent value="forums" className="space-y-4">
            {loadingCommunities ? (
              <div className="py-8 text-center text-gray-500">Loading communities...</div>
            ) : joinedCommunities.length > 0 ? (
              joinedCommunities.map((community: Community) => (
                <Card
                  key={community.id}
                  className="rounded-xl border border-brand-100/60 bg-white shadow-md transition-shadow hover:shadow-lg"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">
                          {community.logo ? (
                            <Image
                              src={community.logo.replace("lens://", "https://api.grove.storage/")}
                              alt={community.name}
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                          ) : (
                            community.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <Link href={`/communities/${community.address}`}>
                            <h3 className="cursor-pointer text-lg font-semibold text-gray-900 hover:text-brand-600">
                              {community.name}
                            </h3>
                          </Link>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Users className="mr-1 h-4 w-4" />
                              {community.memberCount.toLocaleString()} members
                            </div>
                            {community.moderators?.some(
                              m => m.address.toLowerCase() === lensAccount?.address?.toLowerCase(),
                            ) && <Badge className="bg-green-100 text-green-700">Moderator</Badge>}
                          </div>
                        </div>
                      </div>
                      <Link
                        href={`/communities/${community.address}`}
                        className="group inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 shadow-sm ring-1 ring-inset ring-brand-100 transition hover:bg-brand-100 hover:text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-400"
                        aria-label={`View ${community.name} Community`}
                      >
                        <Users className="h-5 w-5 text-brand-400 transition group-hover:text-brand-600" />
                        View Community
                        <ArrowUp className="ml-1 h-4 w-4 -rotate-90 text-brand-300 transition group-hover:text-brand-600" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="py-8 text-center text-gray-500">No communities joined yet</div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
