import { type FC, type ReactNode, useState } from "react";
import type { EditorExtension } from "./extension";
import Button from "./toolbar-button";
import { uploadImage } from "@/lib/services/upload-image";
import { useEditor } from "prosekit/react";
import { PopoverContent, PopoverRoot, PopoverTrigger } from "prosekit/react/popover";

export const ImageUploadPopover: FC<{
  tooltip: string;
  disabled: boolean;
  children: ReactNode;
}> = ({ tooltip, disabled, children }) => {
  const [open, setOpen] = useState(false);
  const [objectUrl, setObjectUrl] = useState("");
  const url = objectUrl;

  const editor = useEditor<EditorExtension>();

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async event => {
    const file = event.target.files?.[0];

    if (file) {
      try {
        // Upload to Grove and get the gateway URL
        const result = await uploadImage(file);
        setObjectUrl(result.gatewayUrl);
      } catch (error) {
        setObjectUrl("");
        // Optionally show error to user
        console.error("Failed to upload image to Grove:", error);
      }
    } else {
      setObjectUrl("");
    }
  };

  const deferResetState = () => {
    setTimeout(() => {
      setObjectUrl("");
    }, 300);
  };

  const handleSubmit = () => {
    if (url) {
      editor.commands.insertImage({
        src: url,
        width: 600,
        height: 400,
      });
      deferResetState();
      setOpen(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      deferResetState();
    }
    setOpen(open);
  };

  return (
    <PopoverRoot open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger>
        <Button pressed={open} disabled={disabled} tooltip={tooltip}>
          {children}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-sm data-[state=open]:animate-duration-150 data-[state=closed]:animate-duration-200 z-10 box-border flex flex-col gap-y-4 rounded-lg border border-gray-200 bg-white p-6 text-sm shadow-lg will-change-transform data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=bottom]:slide-out-to-top-2 data-[side=left]:slide-in-from-right-2 data-[side=left]:slide-out-to-right-2 data-[side=right]:slide-in-from-left-2 data-[side=right]:slide-out-to-left-2 data-[side=top]:slide-in-from-bottom-2 data-[side=top]:slide-out-to-bottom-2 dark:border-gray-800 dark:bg-gray-950 [&:not([data-state])]:hidden">
        {/* Only show file upload */}
        <label>Upload</label>
        <input
          className="box-border flex h-9 w-full rounded-md border border-solid border-gray-200 bg-white px-3 py-2 text-sm outline-none ring-0 ring-transparent transition file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:placeholder:text-gray-500 dark:focus-visible:ring-gray-300"
          accept="image/*"
          type="file"
          onChange={handleFileChange}
        />
        {/* Show insert button if file uploaded */}
        {url ? (
          <button
            type="button"
            className="inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md border-0 bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 ring-offset-white transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:ring-offset-gray-950 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
            onClick={handleSubmit}
          >
            Insert Image
          </button>
        ) : null}
      </PopoverContent>
    </PopoverRoot>
  );
};
