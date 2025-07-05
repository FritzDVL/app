import React from "react";
import type { EditorExtension } from "@/components/editor/extension";
import Button from "@/components/editor/toolbar-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BoldIcon, CheckSquare, ItalicIcon, List, ListOrdered, UnderlineIcon } from "lucide-react";
import type { Editor } from "prosekit/core";
import { useEditorDerivedValue } from "prosekit/react";

function getToolbarItems(editor: Editor<EditorExtension>) {
  return {
    bold: {
      isActive: editor.marks.bold.isActive(),
      canExec: editor.commands.toggleBold.canExec(),
      command: () => editor.commands.toggleBold(),
    },
    italic: {
      isActive: editor.marks.italic.isActive(),
      canExec: editor.commands.toggleItalic.canExec(),
      command: () => editor.commands.toggleItalic(),
    },
    underline: {
      isActive: editor.marks.underline.isActive(),
      canExec: editor.commands.toggleUnderline.canExec(),
      command: () => editor.commands.toggleUnderline(),
    },
    bullet: {
      isActive: editor.nodes.list.isActive({ kind: "bullet" }),
      canExec: editor.commands.toggleList.canExec({ kind: "bullet" }),
      command: () => editor.commands.toggleList({ kind: "bullet" }),
    },
    ordered: {
      isActive: editor.nodes.list.isActive({ kind: "ordered" }),
      canExec: editor.commands.toggleList.canExec({ kind: "ordered" }),
      command: () => editor.commands.toggleList({ kind: "ordered" }),
    },
    task: {
      isActive: editor.nodes.list.isActive({ kind: "task" }),
      canExec: editor.commands.toggleList.canExec({ kind: "task" }),
      command: () => editor.commands.toggleList({ kind: "task" }),
    },
  };
}

export function Toolbar() {
  const items = useEditorDerivedValue(getToolbarItems);

  return (
    <div className="mb-1 flex items-center justify-between overflow-hidden rounded-b-xl border-b-0 border-t border-t-gray-200 bg-white p-2 shadow-none">
      {/* Left side - formatting buttons */}
      <div className="flex items-center gap-1">
        <Button
          pressed={items.bold.isActive}
          disabled={!items.bold.canExec}
          onClick={items.bold.command}
          tooltip="Bold Text"
        >
          <BoldIcon className="h-4 w-4" />
        </Button>
        <Button
          pressed={items.italic.isActive}
          disabled={!items.italic.canExec}
          onClick={items.italic.command}
          tooltip="Italic Text"
        >
          <ItalicIcon className="h-4 w-4" />
        </Button>
        <Button
          pressed={items.underline.isActive}
          disabled={!items.underline.canExec}
          onClick={items.underline.command}
          tooltip="Underline Text"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        {/* List dropdown button - moved here to be next to underline */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <span>
              <Button tooltip="Lists" pressed={items.bullet.isActive || items.ordered.isActive || items.task.isActive}>
                <List className="h-4 w-4" />
              </Button>
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onSelect={e => {
                e.preventDefault();
                items.bullet.command();
              }}
              disabled={!items.bullet.canExec}
              className={items.bullet.isActive ? "bg-gray-100 font-semibold text-black" : ""}
            >
              <List className="mr-2 h-4 w-4" /> Bullet List
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={e => {
                e.preventDefault();
                items.ordered.command();
              }}
              disabled={!items.ordered.canExec}
              className={items.ordered.isActive ? "bg-gray-100 font-semibold text-black" : ""}
            >
              <ListOrdered className="mr-2 h-4 w-4" /> Numbered List
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={e => {
                e.preventDefault();
                items.task.command();
              }}
              disabled={!items.task.canExec}
              className={items.task.isActive ? "bg-gray-100 font-semibold text-black" : ""}
            >
              <CheckSquare className="mr-2 h-4 w-4" /> Task List
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
