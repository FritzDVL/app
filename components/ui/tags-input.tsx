import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Hash, Plus, X } from "lucide-react";

interface TagsInputProps {
  tags: string[];
  tagInput: string;
  setTagInput: (value: string) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  handleTagInputKeyDown: (e: React.KeyboardEvent) => void;
  suggestedTags?: string[];
  maxTags?: number;
}

export function TagsInput({
  tags,
  tagInput,
  setTagInput,
  addTag,
  removeTag,
  handleTagInputKeyDown,
  suggestedTags = [],
  maxTags = 5,
}: TagsInputProps) {
  return (
    <div className="rounded-2xl border bg-white/80 p-3 backdrop-blur-sm focus-within:ring-2 dark:bg-gray-700">
      {/* Selected Tags */}
      <div className="mb-2 flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1 rounded-full bg-brand-100">
            <Hash className="h-3 w-3" />
            {tag}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-4 w-4 rounded-full p-0 hover:bg-brand-300"
              onClick={() => removeTag(tag)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
      {/* Tag Input */}
      <div className="flex h-12 items-center gap-2 rounded-full border-slate-300/60 bg-white/80 text-lg backdrop-blur-sm focus:ring-2 focus:ring-blue-100 dark:bg-gray-700">
        <Input
          value={tagInput}
          onChange={e => setTagInput(e.target.value)}
          onKeyDown={handleTagInputKeyDown}
          placeholder={tags.length === 0 ? "Type a tag and press Enter..." : "Add another tag..."}
          className="border-0 bg-transparent p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
          disabled={tags.length >= maxTags}
        />
        {tagInput.trim() && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-6 w-6 rounded-full bg-brand-100 p-0 hover:bg-brand-200"
            onClick={() => addTag(tagInput)}
          >
            <Plus className="h-3 w-3 text-brand-600" />
          </Button>
        )}
      </div>
      {/* Suggested Tags */}
      {suggestedTags.length > 0 && tags.length < maxTags && (
        <div className="mt-3 border-t border-brand-200 pt-2">
          <p className="mb-2 text-xs text-foreground">Popular tags:</p>
          <div className="flex flex-wrap gap-1">
            {suggestedTags
              .filter(tag => !tags.includes(tag))
              .slice(0, 6)
              .map(tag => (
                <Button
                  key={tag}
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 rounded-full px-2 text-xs text-muted-foreground hover:bg-brand-100 hover:text-brand-700"
                  onClick={() => addTag(tag)}
                >
                  {tag}
                </Button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
