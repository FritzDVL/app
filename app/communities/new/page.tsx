"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CommunityCreationTips } from "@/components/communities/community-creation-tips";
import { Navbar } from "@/components/home/navbar";
import { ProtectedRoute } from "@/components/pages/protected-route";
import { BackNavigationLink } from "@/components/ui/back-navigation-link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCommunityCreation } from "@/hooks/communities/use-community-create";
import { incrementCommunityMembersCount } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth-store";
import { evmAddress } from "@lens-protocol/client";
import { joinGroup } from "@lens-protocol/client/actions";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { useSessionClient } from "@lens-protocol/react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useWalletClient } from "wagmi";

export default function NewCommunityPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // State handling
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    emoji: "",
    image: undefined as File | undefined,
    adminAddress: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hooks
  const { isCreating } = useCommunityCreation();
  const { account } = useAuthStore();
  const sessionClient = useSessionClient();
  const walletClient = useWalletClient();

  // Set adminAddress to account.address if available
  useEffect(() => {
    if (account?.address) {
      setFormData(prev => ({ ...prev, adminAddress: account.address }));
    }
  }, [account?.address]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Prevent image field from being set here
    if (e.target.name === "image") return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionClient.data || !walletClient.data) {
      toast.error("Not logged in", {
        description: "Please log in to create a community.",
      });
      throw new Error("Not logged in");
    }

    setLoading(true);
    setError(null);
    const toastLoading = toast.loading("Creating community...");
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("description", formData.description);
      form.append("adminAddress", formData.adminAddress);
      if (formData.image) {
        form.append("image", formData.image);
      }
      const response = await fetch("/api/communities", {
        method: "POST",
        body: form,
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        setError(result.error || "Community creation failed. Please try again.");
        toast.error("Community creation failed", {
          description: result.error || "Please try again.",
        });
        setLoading(false);
        throw new Error(result.error || "Community creation failed");
      }
      const community = result.community;
      if (community && community.id) {
        // Join the community automatically for admin
        const joinResult = await joinGroup(sessionClient.data, {
          group: evmAddress(community.address),
        }).andThen(handleOperationWith(walletClient.data));
        if (joinResult.isOk()) {
          await incrementCommunityMembersCount(community.id);
        } else {
          console.error("Error joining/leaving community:", joinResult.error);
          toast.error("Action Failed", {
            description: "Unable to update your membership status. Please try again.",
          });
        }
        toast.success("Community created!", {
          description: `Welcome to ${community.name}`,
        });
        // Invalidate and refetch communities list
        await queryClient.invalidateQueries({ queryKey: ["communities"] });
        router.push(`/communities/${community.address}`);
      } else {
        setError("Community creation failed. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create community");
      toast.error("Community creation failed", {
        description: err.message || "Failed to create community",
      });
    } finally {
      setLoading(false);
      toast.dismiss(toastLoading);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-100/40">
        <Navbar />
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
              <Card className="rounded-3xl border border-slate-300/60 bg-white backdrop-blur-sm">
                <CardHeader>
                  <h1 className="text-2xl font-bold text-slate-900">Community Details</h1>
                  <p className="text-slate-600">Fill in the details to start your new community</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-base font-medium text-slate-900">
                        Community Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Lens Developers"
                        className="h-12 rounded-full border-slate-300/60 bg-white/80 text-lg backdrop-blur-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        required
                      />
                    </div>
                    {/* Image Upload (replaces Emoji) */}
                    <div className="space-y-2">
                      <Label htmlFor="image" className="text-base font-medium text-slate-900">
                        Community Image (optional)
                      </Label>
                      <Input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        className="w-full rounded-2xl border-slate-300/60 bg-white/80 backdrop-blur-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          setFormData({ ...formData, image: file });
                        }}
                      />
                      {formData.image && (
                        <div className="mt-2">
                          <span className="text-xs text-slate-500">Selected: {formData.image.name}</span>
                        </div>
                      )}
                    </div>
                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-base font-medium text-slate-900">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe your community..."
                        required
                        className="min-h-[80px] w-full rounded-2xl border border-slate-300/60 bg-white/80 p-3 text-base backdrop-blur-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                    {/* Admin Address */}
                    <div className="space-y-2">
                      <Label htmlFor="adminAddress" className="text-base font-medium text-slate-900">
                        Admin Address
                      </Label>
                      <Input
                        id="adminAddress"
                        name="adminAddress"
                        value={formData.adminAddress}
                        onChange={handleChange}
                        placeholder="0x... (your wallet address)"
                        required
                        className="rounded-2xl border-slate-300/60 bg-white/80 backdrop-blur-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        disabled={!!account?.address}
                      />
                    </div>
                    {error && <div className="text-sm text-red-600">{error}</div>}
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        className="rounded-full bg-gradient-to-r from-green-500 to-green-600 px-6 font-semibold text-white hover:from-green-600 hover:to-green-700"
                        disabled={
                          loading ||
                          isCreating ||
                          !formData.name.trim() ||
                          !formData.description.trim() ||
                          !formData.adminAddress.trim()
                        }
                      >
                        {loading || isCreating ? (
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                            Creating...
                          </div>
                        ) : (
                          <>Create Community</>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
            {/* Sidebar */}
            <div className="space-y-6">
              <CommunityCreationTips />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
