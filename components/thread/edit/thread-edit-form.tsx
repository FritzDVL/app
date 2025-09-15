"use client";

import React, { useEffect, useState } from "react";
import { TextEditor } from "@/components/editor/text-editor";
import { BackNavigationLink } from "@/components/ui/back-navigation-link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TagsInput } from "@/components/ui/tags-input";
import { useTagsInput } from "@/hooks/forms/use-tags-input";
import { useThreadEditForm } from "@/hooks/forms/use-thread-edit-form";
import { getThreadTags, stripThreadArticleFormatting } from "@/lib/domain/threads/content";
import { Thread } from "@/lib/domain/threads/types";
import { Save } from "lucide-react";

interface ThreadEditFormProps {
  thread: Thread;
}

export function ThreadEditForm({ thread }: ThreadEditFormProps) {
  const [initialTags, setInitialTags] = useState<string[]>([]);

  useEffect(() => {
    const doFetchTags = async () => {
      const result = await getThreadTags(thread.rootPost);
      setInitialTags(result);
    };
    doFetchTags();
  }, []);

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
  const { formData, isSaving, handleChange, handleSubmit } = useThreadEditForm(thread);
  const { tags, tagInput, setTagInput, addTag, removeTag, handleTagInputKeyDown } = useTagsInput(initialTags);

  const initialContent =
    thread.rootPost?.metadata?.__typename == "ArticleMetadata"
      ? stripThreadArticleFormatting(thread.rootPost.metadata.content)
      : "";

  return (
    <>
      <BackNavigationLink href={`/thread/${thread.rootPost.id}`}>Back to Thread</BackNavigationLink>
      <Card className="rounded-3xl bg-white backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Edit Thread</h2>
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
                maxLength={100}
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="edit-content" className="text-sm font-medium text-foreground">
                Content
              </Label>
              <div className="rounded-2xl border-brand-200/40 bg-white/50 backdrop-blur-sm dark:bg-gray-800">
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
              <Button type="submit" disabled={isSaving || !formData.title.trim() || !formData.content.trim()}>
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
    </>
  );
}
