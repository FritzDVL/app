import React from "react";
import { TextEditor } from "@/components/editor/text-editor";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export function ThreadReplyBox({
  onCancel,
  onSubmit,
  value,
  onChange,
}: {
  onCancel: () => void;
  onSubmit: () => void;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="mt-3 flex w-full min-w-0 items-start space-x-3">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src="/placeholder.svg?height=32&width=32" />
        <AvatarFallback className="bg-gray-200 text-gray-700">U</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1 space-y-3">
        <div className="w-full min-w-0">
          <TextEditor value={value} onChange={onChange} />
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" size="sm" className="h-8 px-3 text-sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={onSubmit} className="gradient-button h-8 text-sm" disabled={!value.trim()}>
            <MessageCircle className="mr-2 h-2 w-2" />
            Reply
          </Button>
        </div>
      </div>
    </div>
  );
}
