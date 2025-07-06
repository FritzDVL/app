import { GripVertical, Plus } from "lucide-react";
import { BlockHandleAdd, BlockHandleDraggable, BlockHandlePopover } from "prosekit/react/block-handle";

export default function BlockHandle() {
  return (
    <BlockHandlePopover className="data-[state=open]:animate-duration-150 data-[state=closed]:animate-duration-200 box-border flex flex-row items-center justify-center border-0 transition will-change-transform data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 [&:not([data-state])]:hidden">
      <BlockHandleAdd className="box-border flex h-[1.5em] w-[1.5em] cursor-pointer items-center justify-center rounded text-gray-500/50 hover:bg-gray-100 dark:text-gray-500/50 dark:hover:bg-gray-800">
        <Plus className="h-4 w-4" />
      </BlockHandleAdd>
      <BlockHandleDraggable className="box-border flex h-[1.5em] w-[1.2em] cursor-grab items-center justify-center rounded text-gray-500/50 hover:bg-gray-100 dark:text-gray-500/50 dark:hover:bg-gray-800">
        <GripVertical className="h-4 w-4" />
      </BlockHandleDraggable>
    </BlockHandlePopover>
  );
}
