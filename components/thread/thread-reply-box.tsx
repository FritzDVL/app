import React, { useState } from "react";
import { TextEditor } from "@/components/editor/text-editor";
import ContentRenderer from "@/components/shared/content-renderer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { MessageCircle } from "lucide-react";

interface ThreadReplyBoxProps {
  onCancel: () => void;
  onSubmit: () => void;
  value: string;
  onChange: (value: string) => void;
}

export function ThreadReplyBox({ onCancel, onSubmit, value, onChange }: ThreadReplyBoxProps) {
  const { account } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-3 flex w-full min-w-0 items-start space-x-3">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={account?.metadata?.picture} />
        <AvatarFallback className="bg-gray-200 text-gray-700">U</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1 space-y-3">
        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200 text-sm dark:border-gray-700">
          <button
            onClick={() => setIsPreview(false)}
            className={`pb-2 font-medium ${!isPreview ? "border-b-2 border-brand-500 text-brand-600" : "text-muted-foreground hover:text-foreground"}`}
          >
            Write
          </button>
          <button
            onClick={() => setIsPreview(true)}
            className={`pb-2 font-medium ${isPreview ? "border-b-2 border-brand-500 text-brand-600" : "text-muted-foreground hover:text-foreground"}`}
          >
            Preview
          </button>
        </div>

        <div className="w-full min-w-0">
          {isPreview ? (
            <div className="min-h-[150px] rounded-2xl border border-transparent bg-slate-50 p-4 dark:bg-slate-800/50">
              {value ? (
                <ContentRenderer content={{ content: value }} className="rich-text-content" />
              ) : (
                <p className="text-sm italic text-muted-foreground">Nothing to preview</p>
              )}
            </div>
          ) : (
            <TextEditor onChange={onChange} initialValue={value} />
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" size="sm" className="h-8 px-3 text-sm" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            className="gradient-button h-8 text-sm"
            disabled={!value.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <span className="loader mr-2 h-3 w-3 animate-spin rounded-full border-2 border-t-2 border-gray-300 border-t-green-500" />
                Replying...
              </span>
            ) : (
              <>
                <MessageCircle className="mr-2 h-2 w-2" />
                Reply
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
