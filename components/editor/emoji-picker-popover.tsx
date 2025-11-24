import { type FC, useState } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Smile } from "lucide-react";
import { useEditor } from "prosekit/react";
import { PopoverContent, PopoverRoot, PopoverTrigger } from "prosekit/react/popover";
import Button from "./toolbar-button";
import type { EditorExtension } from "./extension";

export const EmojiPickerPopover: FC<{
  tooltip: string;
  disabled: boolean;
}> = ({ tooltip, disabled }) => {
  const [open, setOpen] = useState(false);
  const editor = useEditor<EditorExtension>();

  const onEmojiClick = (emojiData: EmojiClickData) => {
    editor.commands.insertText({ text: emojiData.emoji });
    setOpen(false);
  };

  return (
    <PopoverRoot open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button pressed={open} disabled={disabled} tooltip={tooltip}>
          <Smile className="h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="z-50 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-950">
        <EmojiPicker onEmojiClick={onEmojiClick} theme="auto" />
      </PopoverContent>
    </PopoverRoot>
  );
};
