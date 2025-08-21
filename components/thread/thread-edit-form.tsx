"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useThreadUpdate } from "@/hooks/threads/use-thread-update";
import { stripThreadArticleFormatting } from "@/lib/domain/threads/content";
import { Thread } from "@/lib/domain/threads/types";
import { Save, X } from "lucide-react";

interface ThreadEditFormProps {
  thread: Thread;
  onCancel: () => void;
  onSuccess?: () => void;
}

function getThreadContent(thread: Thread): string {
  const metadata = thread?.rootPost?.metadata;
  if (metadata && typeof metadata === "object" && "content" in metadata) {
    return metadata.content ?? "";
  }
  return "";
}

export function ThreadEditForm({ thread, onCancel, onSuccess }: ThreadEditFormProps) {
  const [formData, setFormData] = useState({
    title: thread.title,
    summary: thread.summary,
    content: stripThreadArticleFormatting(getThreadContent(thread)),
    tags: Array.isArray(thread.tags) ? thread.tags.join(", ") : "",
  });

  const { updateThread, isUpdating } = useThreadUpdate();

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      return;
    }

    try {
      await updateThread(thread, formData, () => {
        if (onSuccess) onSuccess();
      });
    } catch (error) {
      console.error("Error updating thread:", error);
    }
  };

  return (
    <Card className="rounded-3xl bg-white backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Edit Thread</h2>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="edit-title" className="text-sm font-medium text-foreground">
              Title
            </Label>
            <Input
              id="edit-title"
              value={formData.title}
              onChange={e => handleChange("title", e.target.value)}
              placeholder="Thread title"
              className="h-12 rounded-full border-slate-300/60 bg-white/80 text-lg backdrop-blur-sm focus:ring-2 focus:ring-blue-100 dark:bg-gray-700"
              required
            />
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <Label htmlFor="edit-summary" className="text-sm font-medium text-foreground">
              Summary
            </Label>
            <Input
              id="edit-summary"
              value={formData.summary}
              onChange={e => handleChange("summary", e.target.value)}
              placeholder="Brief description"
              className="h-12 rounded-full border-slate-300/60 bg-white/80 text-lg backdrop-blur-sm focus:ring-2 dark:bg-gray-700"
              maxLength={100}
            />
          </div>

          {/* Content Editor - Using Textarea for now, can be enhanced later */}
          <div className="space-y-2">
            <Label htmlFor="edit-content" className="text-sm font-medium text-foreground">
              Content
            </Label>
            <Textarea
              id="edit-content"
              value={formData.content}
              onChange={e => handleChange("content", e.target.value)}
              placeholder="Write your thread content..."
              className="min-h-[200px] resize-none border-slate-200 text-base leading-relaxed focus:ring-2 focus:ring-brand-200"
              required
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="edit-tags" className="text-sm font-medium text-foreground">
              Tags (optional)
            </Label>
            <Input
              id="edit-tags"
              value={formData.tags}
              onChange={e => handleChange("tags", e.target.value)}
              placeholder="Separate tags with commas"
              className="h-12 rounded-full border-slate-300/60 bg-white/80 backdrop-blur-sm focus:ring-2 dark:bg-gray-700"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isUpdating}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUpdating || !formData.title.trim() || !formData.content.trim()}
              className="rounded-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50"
            >
              {isUpdating ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                  Updating...
                </div>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
