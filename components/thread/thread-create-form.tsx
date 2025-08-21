import { TextEditor } from "@/components/editor/text-editor";
import { ReputationStatusBanner } from "@/components/shared/reputation-status-banner";
import { TagsInput } from "@/components/thread/tags-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLensReputationScore } from "@/hooks/common/use-lensreputation-score";
import { useTagsInput } from "@/hooks/forms/use-tags-input";
import { useThreadCreateForm } from "@/hooks/forms/use-thread-create-form";
import { useAuthStore } from "@/stores/auth-store";
import { Address } from "@/types/common";
import { Send } from "lucide-react";
import { toast } from "sonner";

interface ThreadCreateFormProps {
  communityAddress: string;
}

export function ThreadCreateForm({ communityAddress }: ThreadCreateFormProps) {
  const { account, walletAddress } = useAuthStore();
  const { reputation, canCreateThread } = useLensReputationScore(walletAddress as Address, account?.address);
  const { formData, setFormData, handleChange, handleSubmit, isCreating } = useThreadCreateForm({
    communityAddress,
    author: account?.address || "",
  });
  const { tags, tagInput, setTagInput, addTag, removeTag, handleTagInputKeyDown } = useTagsInput();

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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreateThread) {
      if (reputation === undefined) {
        toast.error("LensReputation NFT Required", {
          description: "You need to mint the LensReputation NFT to create threads.",
        });
      } else {
        toast.error("Insufficient Reputation", {
          description: `You need a reputation score of 400 or higher to create threads. Your current score is ${reputation}.`,
        });
      }
      return;
    }

    const newFormData = { ...formData, tags: tags.join(",") };
    setFormData(newFormData);
    handleSubmit(e, newFormData);
  };

  return (
    <Card className="rounded-3xl border border-brand-200/60 bg-white backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-800">
      <CardHeader className="pb-4">
        <h1 className="text-2xl font-medium text-foreground">Create New Thread</h1>
        <p className="text-muted-foreground">Share your thoughts with the community</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-foreground">
              Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={e => handleChange("title", e.target.value)}
              placeholder="What's your thread about?"
              className="h-12 rounded-full border-slate-300/60 bg-white/80 text-lg backdrop-blur-sm focus:ring-2 focus:ring-blue-100 dark:bg-gray-700"
              required
            />
          </div>
          {/* Summary */}
          <div className="space-y-2">
            <Label htmlFor="summary" className="text-sm font-medium text-foreground">
              Summary
            </Label>
            <Input
              id="summary"
              value={formData.summary}
              onChange={e => handleChange("summary", e.target.value)}
              placeholder="Brief description (max 100 chars)"
              className="h-12 rounded-full border-slate-300/60 bg-white/80 text-lg backdrop-blur-sm focus:ring-2 dark:bg-gray-700"
              maxLength={100}
            />
          </div>
          {/* Content Editor */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium text-foreground">
              Content
            </Label>
            <div className="rounded-2xl border-brand-200/40 bg-white/50 p-4 backdrop-blur-sm dark:bg-gray-800">
              <TextEditor onChange={value => handleChange("content", value)} />
            </div>
          </div>
          {/* Tags Input */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-sm font-medium text-foreground">
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
          {/* Reputation Status */}
          <ReputationStatusBanner
            reputation={reputation}
            canPerformAction={canCreateThread}
            actionType="threads"
            requiredScore={400}
          />
          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isCreating || !canCreateThread || !formData.title.trim() || !formData.content.trim()}
              className="rounded-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50"
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
  );
}
