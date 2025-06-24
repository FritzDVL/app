"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { BackNavigationLink } from "@/components/ui/back-navigation-link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCommunityCreation } from "@/hooks/use-community-create";
import { useAuthStore } from "@/stores/auth-store";

export default function NewCommunityPage() {
  const router = useRouter();

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
  const { createCommunity, isCreating } = useCommunityCreation();
  const { account } = useAuthStore();

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
    setLoading(true);
    setError(null);
    try {
      await createCommunity({ ...formData }, (community: any) => {
        if (community && community.id) {
          router.push(`/communities/${community.id}`);
        } else {
          setError("Community creation failed. Please try again.");
        }
      });
    } catch (err: any) {
      setError(err.message || "Failed to create community");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Header with back button and title */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <BackNavigationLink href="/communities">Back to Communities</BackNavigationLink>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Create a New Community</h2>
              <p className="text-sm text-slate-500">Start a new space for your interests</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Card className="border-0 bg-white/70 shadow-sm backdrop-blur-sm">
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
                      className="h-12 border-slate-200 text-lg focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
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
                      className="w-full border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
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
                      className="min-h-[80px] w-full rounded-lg border border-slate-200 bg-white/80 p-3 text-base focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
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
                      className="border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                      disabled={!!account?.address}
                    />
                  </div>
                  {error && <div className="text-sm text-red-600">{error}</div>}
                  <Button
                    type="submit"
                    className="w-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600 text-lg font-semibold text-white shadow-lg hover:from-brand-600 hover:to-brand-700"
                    disabled={loading || isCreating}
                  >
                    {loading || isCreating ? "Creating..." : "Create Community"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-0 bg-white/70 shadow-sm backdrop-blur-sm">
              <CardHeader>
                <h3 className="text-lg font-semibold text-slate-900">Community Creation Tips</h3>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Pick a clear, descriptive name</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Choose a relevant category</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Write a concise, inviting description</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Use an emoji to make your community stand out</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-red-500">×</span>
                  <span>No spam or irrelevant content</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
