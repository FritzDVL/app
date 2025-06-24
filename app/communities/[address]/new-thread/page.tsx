"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { TextEditor } from "@/components/text-editor";
import { BackNavigationLink } from "@/components/ui/back-navigation-link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCommunityDetails } from "@/hooks/use-community-details";
import { CreateThreadFormData, useThreadCreation } from "@/hooks/use-thread-create";
import { useAuthStore } from "@/stores/auth-store";
import { Send } from "lucide-react";
import { toast } from "sonner";

export default function NewThreadPage() {
  const params = useParams();
  const router = useRouter();
  const communityAddress = params.address as string;

  // Use custom hooks
  const { communityDetails, isLoading } = useCommunityDetails(communityAddress);
  const { createThread, isCreating } = useThreadCreation();
  const { account } = useAuthStore();

  const [formData, setFormData] = useState<CreateThreadFormData>({
    title: "",
    summary: "",
    content: "",
    tags: "",
    author: account?.address || "", // Ensure author is always a string
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Validation Error", {
        description: "Please enter a thread title.",
      });
      return;
    }

    if (!formData.summary.trim()) {
      toast.error("Validation Error", {
        description: "Please enter a summary.",
      });
      return;
    }

    if (!formData.content.trim()) {
      toast.error("Validation Error", {
        description: "Please enter thread content.",
      });
      return;
    }

    try {
      // Use the Lens group address for thread creation
      if (!communityDetails) throw new Error("Community details not loaded");
      if (!account?.address) throw new Error("User address not found");
      await createThread(communityDetails.id, { ...formData, author: account.address }, () => {
        setFormData({ title: "", summary: "", content: "", tags: "", author: account.address });
        setUploadedImages([]);
      });
      // Redirect back to community using the Lens group address
      router.push(`/communities/${communityDetails.id}`);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Here you would upload the images to your storage service
      // For now, we'll just simulate with placeholder URLs
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setUploadedImages(prev => [...prev, ...newImages]);
      toast.success("Images uploaded successfully!");
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-24">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-brand-500"></div>
          <p className="text-lg font-medium text-slate-600">Loading community...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <BackNavigationLink href={`/communities/${communityAddress}`}>Back to Community</BackNavigationLink>
            {communityDetails && (
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-sm font-bold text-white">
                  {communityDetails.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{communityDetails.name}</h2>
                  <p className="text-sm text-slate-500">Create a new thread</p>
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isCreating || !formData.title.trim() || !formData.content.trim()}
            className="rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-6 font-semibold text-white shadow-lg hover:from-brand-600 hover:to-brand-700"
          >
            {isCreating ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                Publishing...
              </div>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Publish Thread
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Card className="rounded-xl border border-border bg-card shadow-md">
              <CardHeader>
                <h1 className="text-2xl font-bold text-slate-900">Create New Thread</h1>
                <p className="text-slate-600">Share your thoughts, questions, or ideas with the community</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-base font-medium text-slate-900">
                      Thread Title
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      placeholder="What's your thread about?"
                      className="h-12 border-slate-200 text-lg focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                      required
                    />
                  </div>

                  {/* Summary */}
                  <div className="space-y-2">
                    <Label htmlFor="summary" className="text-base font-medium text-slate-900">
                      Summary
                    </Label>
                    <Input
                      id="summary"
                      value={formData.summary}
                      onChange={e => setFormData({ ...formData, summary: e.target.value })}
                      placeholder="A short summary of your thread (max 100 chars)"
                      className="border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                      maxLength={100}
                    />
                  </div>

                  {/* Content Editor */}
                  <div className="space-y-2">
                    <Label htmlFor="content" className="text-base font-medium text-slate-900">
                      Content
                    </Label>
                    <TextEditor
                      value={formData.content}
                      onChange={e => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Write your thread content here... You can add formatting, images, and detailed explanations."
                      minHeightClass="min-h-[400px]"
                      onImageUpload={handleImageUpload}
                    />
                  </div>

                  {/* Uploaded Images */}
                  {uploadedImages.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-base font-medium text-slate-900">Attached Images</Label>
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                        {uploadedImages.map((image, index) => (
                          <div key={index} className="group relative">
                            <Image
                              src={image}
                              alt={`Upload ${index + 1}`}
                              className="h-24 w-full rounded-lg border border-slate-200 object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute right-1 top-1 h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                              onClick={() => removeImage(index)}
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="space-y-2">
                    <Label htmlFor="tags" className="text-base font-medium text-slate-900">
                      Tags (optional)
                    </Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={e => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="development, discussion, help, tutorial (comma separated)"
                      className="border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                    />
                    {formData.tags && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {formData.tags.split(",").map(
                          (tag, index) =>
                            tag.trim() && (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag.trim()}
                              </Badge>
                            ),
                        )}
                      </div>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Guidelines */}
            <Card className="rounded-xl border border-border bg-card shadow-md">
              <CardHeader>
                <h3 className="text-lg font-semibold text-slate-900">Posting Guidelines</h3>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Be respectful and constructive</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Use clear, descriptive titles</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Add relevant tags to help others find your post</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Include context and details</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-red-500">×</span>
                  <span>No spam or self-promotion</span>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card className="rounded-xl border border-border bg-card shadow-md">
              <CardHeader>
                <h3 className="text-lg font-semibold text-slate-900">Preview</h3>
              </CardHeader>
              <CardContent>
                {formData.title || formData.content ? (
                  <div className="space-y-3">
                    {formData.title && <h4 className="text-lg font-semibold text-slate-900">{formData.title}</h4>}
                    {formData.content && (
                      <p className="line-clamp-4 text-sm leading-relaxed text-slate-600">{formData.content}</p>
                    )}
                    {formData.tags && (
                      <div className="flex flex-wrap gap-1">
                        {formData.tags.split(",").map(
                          (tag, index) =>
                            tag.trim() && (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag.trim()}
                              </Badge>
                            ),
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">Start typing to see a preview...</p>
                )}
              </CardContent>
            </Card>

            {/* Community Info */}
            {communityDetails && (
              <Card className="rounded-xl border border-border bg-card shadow-md">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-slate-900">Posting to</h3>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    {communityDetails.logo ? (
                      <Image
                        src={communityDetails.logo.replace("lens://", "https://api.grove.storage/")}
                        alt={communityDetails.name}
                        width={64}
                        height={64}
                        className="h-10 w-10 rounded-full border border-slate-200 bg-white object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-600 text-lg font-bold text-white">
                        {communityDetails.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-slate-900">{communityDetails.name}</h4>
                      <p className="text-sm text-slate-500">{communityDetails.members.toLocaleString()} members</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
