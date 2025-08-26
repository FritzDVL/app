"use client";

import React from "react";
import { TextEditor } from "@/components/editor/text-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TagsInput } from "@/components/ui/tags-input";
import { useTagsInput } from "@/hooks/forms/use-tags-input";
import { useThreadEditForm } from "@/hooks/forms/use-thread-edit-form";
import { stripThreadArticleFormatting } from "@/lib/domain/threads/content";
import { Thread } from "@/lib/domain/threads/types";
import { Save, X } from "lucide-react";

interface ThreadEditFormProps {
  thread: Thread;
  onCancel: () => void;
  onSuccess?: () => void;
}

export function ThreadEditForm({ thread, onCancel, onSuccess }: ThreadEditFormProps) {
  const suggestedTags = [
    "discussion",
    "help",
    "development",
    "question",
    "announcement",
    "tutorial",
    "feedback",
    "showcase",
    "governance",
    "research",
  ];
  const { formData, isSaving, handleChange, handleSubmit } = useThreadEditForm(thread, onSuccess);
  const { tags, tagInput, setTagInput, addTag, removeTag, handleTagInputKeyDown } = useTagsInput(
    Array.isArray(thread.tags)
      ? (thread.tags as string[])
      : typeof thread.tags === "string"
        ? (thread.tags as string)
            .split(",")
            .map((t: string) => t.trim())
            .filter(Boolean)
        : [],
  );

  const initialContent =
    thread.rootPost?.metadata?.__typename == "ArticleMetadata"
      ? stripThreadArticleFormatting(thread.rootPost.metadata.content)
      : "";

  return (
    <Card className="rounded-3xl bg-white backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Edit Thread</h2>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Update your thread details below. Make sure your changes are clear and helpful for the community.
        </p>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <form onSubmit={e => handleSubmit(e, tags, tagInput, setTagInput)} className="space-y-6">
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
              placeholder="Brief description (max 100 chars)"
              className="h-12 rounded-full border-slate-300/60 bg-white/80 text-lg backdrop-blur-sm focus:ring-2 dark:bg-gray-700"
              maxLength={100}
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="edit-content" className="text-sm font-medium text-foreground">
              Content
            </Label>
            <div className="rounded-2xl border-brand-200/40 bg-white/50 p-4 backdrop-blur-sm dark:bg-gray-800">
              <TextEditor onChange={value => handleChange("content", value)} initialValue={initialContent} />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="edit-tags" className="text-sm font-medium text-foreground">
              Tags (optional) {tags.length > 0 && <span className="text-slate-500">({tags.length}/5)</span>}
            </Label>
            <TagsInput
              tags={tags}
              tagInput={tagInput}
              setTagInput={setTagInput}
              addTag={addTag}
              removeTag={removeTag}
              handleTagInputKeyDown={handleTagInputKeyDown}
              suggestedTags={suggestedTags}
              maxTags={5}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              className="rounded-full bg-gray-300 text-gray-800 hover:bg-gray-400"
              onClick={onCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving || !formData.title.trim() || !formData.content.trim()}
              className="rounded-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50"
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
                  Saving...
                </span>
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
