import React from "react";
import type { EditorExtension } from "@/components/editor/extension";
import Button from "@/components/editor/toolbar-button";
import { CheckSquare, ChevronDown, List, ListOrdered } from "lucide-react";
import type { Editor } from "prosekit/core";
import { useEditorDerivedValue } from "prosekit/react";

function getToolbarItems(editor: Editor<EditorExtension>) {
  return {
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
    toggle: {
      isActive: editor.nodes.list.isActive({ kind: "toggle" }),
      canExec: editor.commands.toggleList.canExec({ kind: "toggle" }),
      command: () => editor.commands.toggleList({ kind: "toggle" }),
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

        <Button
          pressed={items.toggle.isActive}
          disabled={!items.toggle.canExec}
          onClick={items.toggle.command}
          tooltip="Toggle List"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
