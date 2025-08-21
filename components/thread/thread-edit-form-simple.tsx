"use client";

import React, { useState } from "react";
import { TextEditor } from "@/components/editor/text-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar la lógica de actualización
    console.log("Datos del formulario:", formData);
    console.log("rootPost:", thread.rootPost);

    // Por ahora solo simular éxito
    if (onSuccess) onSuccess();
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
        {/* Debug info - mostrar datos del rootPost */}
        <div className="mt-4 rounded-lg bg-gray-100 p-3 text-xs dark:bg-gray-700">
          <p>
            <strong>Thread ID:</strong> {thread.id}
          </p>
          <p>
            <strong>Root Post ID:</strong> {thread.rootPost?.id || "No rootPost"}
          </p>
          <p>
            <strong>Author:</strong> {thread.author.address}
          </p>
          <p>
            <strong>Content URI:</strong> {thread.rootPost?.contentUri || "N/A"}
          </p>
          <p>
            <strong>Metadata Type:</strong> {thread.rootPost?.metadata?.__typename || "N/A"}
          </p>
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
              className="h-12 rounded-full border-slate-300/60 bg-white/80 backdrop-blur-sm focus:ring-2 dark:bg-gray-700"
              maxLength={100}
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="edit-content" className="text-sm font-medium text-foreground">
              Content
            </Label>
            <div className="rounded-2xl border-brand-200/40 bg-white/50 p-4 backdrop-blur-sm dark:bg-gray-800">
              <TextEditor onChange={value => handleChange("content", value)} initialValue={formData.content} />
            </div>
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
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.title.trim() || !formData.content.trim()}
              className="rounded-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
