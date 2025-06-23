import React from "react";
import { TextEditor } from "@/components/text-editor";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export function ThreadReplyBox({
  onCancel,
  onSubmit,
  value,
  onChange,
  onImageUpload,
}: {
  onCancel: () => void;
  onSubmit: () => void;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="mt-4 flex items-start space-x-4">
      <Avatar className="h-8 w-8">
        <AvatarImage src="/placeholder.svg?height=32&width=32" />
        <AvatarFallback className="bg-gradient-to-r from-brand-400 to-brand-600 text-white">U</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <TextEditor
          value={value}
          onChange={onChange}
          placeholder="Write your reply..."
          minHeightClass="min-h-[80px]"
          onImageUpload={onImageUpload}
        />
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={onSubmit} className="gradient-button" disabled={!value.trim()}>
            <MessageCircle className="mr-2 h-4 w-4" />
            Reply
          </Button>
        </div>
      </div>
    </div>
  );
}
