import React from "react";
import type { EditorExtension } from "@/components/editor/extension";
import Button from "@/components/editor/toolbar-button";
import { EMOJIS } from "@/components/emojis";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BoldIcon, CheckSquare, Code, ItalicIcon, List, ListOrdered, Smile, UnderlineIcon } from "lucide-react";
import type { Editor } from "prosekit/core";
import { useEditor, useEditorDerivedValue } from "prosekit/react";

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
    heading1: {
      isActive: editor.nodes.heading.isActive({ level: 1 }),
      canExec: editor.commands.toggleHeading.canExec({ level: 1 }),
      command: () => editor.commands.toggleHeading({ level: 1 }),
    },
    heading2: {
      isActive: editor.nodes.heading.isActive({ level: 2 }),
      canExec: editor.commands.toggleHeading.canExec({ level: 2 }),
      command: () => editor.commands.toggleHeading({ level: 2 }),
    },
    heading3: {
      isActive: editor.nodes.heading.isActive({ level: 3 }),
      canExec: editor.commands.toggleHeading.canExec({ level: 3 }),
      command: () => editor.commands.toggleHeading({ level: 3 }),
    },
    codeBlock: {
      isActive: editor.nodes.codeBlock.isActive(),
      canExec: editor.commands.setCodeBlock.canExec(),
      command: () => editor.commands.setCodeBlock(),
    },
  };
}

export function Toolbar() {
  const items = useEditorDerivedValue(getToolbarItems);
  const editor = useEditor<EditorExtension>();

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
        {/* Headings dropdown button - placed after list dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <span>
              <Button
                tooltip="Headings"
                pressed={items.heading1.isActive || items.heading2.isActive || items.heading3.isActive}
              >
                <span className="text-xs font-bold">H</span>
              </Button>
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onSelect={e => {
                e.preventDefault();
                items.heading1.command();
              }}
              disabled={!items.heading1.canExec}
              className={items.heading1.isActive ? "bg-gray-100 font-semibold text-black" : ""}
            >
              <span className="mr-2 font-bold">H1</span> Heading 1
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={e => {
                e.preventDefault();
                items.heading2.command();
              }}
              disabled={!items.heading2.canExec}
              className={items.heading2.isActive ? "bg-gray-100 font-semibold text-black" : ""}
            >
              <span className="mr-2 font-bold">H2</span> Heading 2
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={e => {
                e.preventDefault();
                items.heading3.command();
              }}
              disabled={!items.heading3.canExec}
              className={items.heading3.isActive ? "bg-gray-100 font-semibold text-black" : ""}
            >
              <span className="mr-2 font-bold">H3</span> Heading 3
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Emoji picker button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <span>
              <Button tooltip="Insert Emoji">
                <Smile className="h-4 w-4" />
              </Button>
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64 p-2">
            <div className="grid max-h-56 grid-cols-8 gap-1 overflow-y-auto" role="grid" aria-label="Emoji picker">
              {EMOJIS.map((emoji, i) => (
                <button
                  key={emoji + i}
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-xl hover:bg-gray-100 focus:bg-gray-200 focus:outline-none"
                  tabIndex={0}
                  aria-label={`Insert emoji ${emoji}`}
                  onClick={() => {
                    editor.view.dispatch(editor.view.state.tr.insertText(emoji));
                    editor.view.focus();
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Code block button */}
        <Button
          pressed={items.codeBlock.isActive}
          disabled={!items.codeBlock.canExec}
          onClick={items.codeBlock.command}
          tooltip="Code Block"
        >
          <Code className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
