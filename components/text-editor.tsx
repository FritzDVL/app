import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bold, Image as ImageUpload, Italic, LinkIcon, List, Quote } from "lucide-react";

interface TextEditorProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  minHeightClass?: string;
  onImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export function TextEditor({
  value,
  onChange,
  placeholder = "Write here...",
  minHeightClass = "min-h-[80px]",
  onImageUpload,
  disabled = false,
}: TextEditorProps) {
  return (
    <div className="space-y-2">
      {/* Formatting Toolbar */}
      <div className="flex items-center space-x-2 rounded-lg border border-slate-200 bg-slate-50 p-2">
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Italic className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
          <List className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Quote className="h-4 w-4" />
        </Button>
        <div className="h-4 w-px bg-slate-300"></div>
        {onImageUpload && (
          <label htmlFor="editorImageUpload">
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
              <span className="cursor-pointer">
                <ImageUpload className="h-4 w-4" />
              </span>
            </Button>
            <input
              id="editorImageUpload"
              type="file"
              multiple
              accept="image/*"
              onChange={onImageUpload}
              className="hidden"
            />
          </label>
        )}
      </div>
      <Textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`focus:border-brand-500 focus:ring-brand-200 ${minHeightClass} resize-y border-slate-200 text-base leading-relaxed focus:ring-2`}
        disabled={disabled}
      />
    </div>
  );
}
