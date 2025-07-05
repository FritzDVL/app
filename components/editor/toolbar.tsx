import React from "react";
import type { EditorExtension } from "@/components/editor/extension";
import Button from "@/components/editor/toolbar-button";
import { BoldIcon, CheckSquare, ItalicIcon, List, ListOrdered } from "lucide-react";
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
          <BoldIcon className="bold h-4 w-4" />
        </Button>
        <Button
          pressed={items.italic.isActive}
          disabled={!items.italic.canExec}
          onClick={items.italic.command}
          tooltip="Italic Text"
        >
          <ItalicIcon className="bold h-4 w-4" />
        </Button>
        <Button
          pressed={items.bullet.isActive}
          disabled={!items.bullet.canExec}
          onClick={items.bullet.command}
          tooltip="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          pressed={items.ordered.isActive}
          disabled={!items.ordered.canExec}
          onClick={items.ordered.command}
          tooltip="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Button
          pressed={items.task.isActive}
          disabled={!items.task.canExec}
          onClick={items.task.command}
          tooltip="Task List"
        >
          <CheckSquare className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
