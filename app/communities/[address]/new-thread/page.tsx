"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CommunityRules } from "@/components/community-rules";
import { Navbar } from "@/components/navbar";
import { TextEditor } from "@/components/text-editor";
import { BackNavigationLink } from "@/components/ui/back-navigation-link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateThreadFormData, useThreadCreation } from "@/hooks/use-thread-create";
import { useAuthStore } from "@/stores/auth-store";
import { useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { toast } from "sonner";

export default function NewThreadPage() {
  const params = useParams();
  const router = useRouter();
  const communityAddress = params.address as string;

  const { createThread, isCreating } = useThreadCreation();
  const { account } = useAuthStore();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<CreateThreadFormData>({
    title: "",
    summary: "",
    content: "",
    tags: "",
    author: account?.address || "", // Ensure author is always a string
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Validation Error", { description: "Please enter a thread title." });
      return;
    }
    if (!formData.summary.trim()) {
      toast.error("Validation Error", { description: "Please enter a summary." });
      return;
    }
    if (!formData.content.trim()) {
      toast.error("Validation Error", { description: "Please enter thread content." });
      return;
    }
    try {
      if (!account?.address) throw new Error("User address not found");
      await createThread(communityAddress, { ...formData, author: account.address }, () => {
        setFormData({ title: "", summary: "", content: "", tags: "", author: account.address });
      });
      // Invalidate and refetch threads for this community
      await queryClient.invalidateQueries({ queryKey: ["threads", communityAddress] });
      router.push(`/communities/${communityAddress}`);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-100/40">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center">
          <BackNavigationLink href={`/communities/${communityAddress}`}>Back to Community</BackNavigationLink>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="rounded-3xl border border-slate-300/60 bg-white backdrop-blur-sm">
              <CardHeader className="pb-4">
                <h1 className="text-2xl font-medium text-slate-900">Create New Thread</h1>
                <p className="text-slate-600">Share your thoughts with the community</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium text-slate-700">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      placeholder="What's your thread about?"
                      className="rounded-full border-slate-300/60 bg-white/80 backdrop-blur-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      required
                    />
                  </div>

                  {/* Summary */}
                  <div className="space-y-2">
                    <Label htmlFor="summary" className="text-sm font-medium text-slate-700">
                      Summary
                    </Label>
                    <Input
                      id="summary"
                      value={formData.summary}
                      onChange={e => setFormData({ ...formData, summary: e.target.value })}
                      placeholder="Brief description (max 100 chars)"
                      className="rounded-2xl border-slate-300/60 bg-white/80 backdrop-blur-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      maxLength={100}
                    />
                  </div>

                  {/* Content Editor */}
                  <div className="space-y-2">
                    <Label htmlFor="content" className="text-sm font-medium text-slate-700">
                      Content
                    </Label>
                    <div className="rounded-2xl border border-slate-300/60 bg-white/80 p-4 backdrop-blur-sm">
                      <TextEditor
                        value={formData.content}
                        onChange={function (value: string): void {
                          setFormData({ ...formData, content: value });
                        }}
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <Label htmlFor="tags" className="text-sm font-medium text-slate-700">
                      Tags (optional)
                    </Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={e => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="development, discussion, help (comma separated)"
                      className="rounded-2xl border-slate-300/60 bg-white/80 backdrop-blur-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                    {formData.tags && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {formData.tags.split(",").map(
                          (tag: string, index: number) =>
                            tag.trim() && (
                              <Badge
                                key={index}
                                variant="outline"
                                className="rounded-full border-slate-300/60 bg-white/80 text-slate-600 backdrop-blur-sm"
                              >
                                {tag.trim()}
                              </Badge>
                            ),
                        )}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      disabled={isCreating || !formData.title.trim() || !formData.content.trim()}
                      className="rounded-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
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
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Guidelines */}
            <CommunityRules variant="posting" />
          </div>
        </div>
      </main>
    </div>
  );
}
