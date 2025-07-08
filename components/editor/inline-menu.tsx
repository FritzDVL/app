import { useState } from "react";
import type { EditorExtension } from "./extension";
import Button from "./toolbar-button";
import { Bold, Code, Italic, Link, Strikethrough, Underline } from "lucide-react";
import type { Editor } from "prosekit/core";
import type { LinkAttrs } from "prosekit/extensions/link";
import type { EditorState } from "prosekit/pm/state";
import { useEditor, useEditorDerivedValue } from "prosekit/react";
import { InlinePopover } from "prosekit/react/inline-popover";

function getInlineMenuItems(editor: Editor<EditorExtension>) {
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
    strike: {
      isActive: editor.marks.strike.isActive(),
      canExec: editor.commands.toggleStrike.canExec(),
      command: () => editor.commands.toggleStrike(),
    },
    code: {
      isActive: editor.marks.code.isActive(),
      canExec: editor.commands.toggleCode.canExec(),
      command: () => editor.commands.toggleCode(),
    },
    link: {
      isActive: editor.marks.link.isActive(),
      canExec: editor.commands.addLink.canExec({ href: "" }),
      command: () => editor.commands.expandLink(),
      currentLink: getCurrentLink(editor.state),
    },
  };
}

function getCurrentLink(state: EditorState): string | undefined {
  const { $from } = state.selection;
  const marks = $from.marksAcross($from);
  if (!marks) {
    return;
  }
  for (const mark of marks) {
    if (mark.type.name === "link") {
      return (mark.attrs as LinkAttrs).href;
    }
  }
}

export default function InlineMenu() {
  const editor = useEditor<EditorExtension>();
  const items = useEditorDerivedValue(getInlineMenuItems);

  const [linkMenuOpen, setLinkMenuOpen] = useState(false);
  const toggleLinkMenuOpen = () => setLinkMenuOpen(open => !open);

  const handleLinkUpdate = (href?: string) => {
    if (href) {
      editor.commands.addLink({ href });
    } else {
      editor.commands.removeLink();
    }

    setLinkMenuOpen(false);
    editor.focus();
  };

  return (
    <>
      <InlinePopover
        data-testid="inline-menu-main"
        className="relative z-10 box-border flex min-w-[8rem] space-x-1 overflow-auto whitespace-nowrap rounded-md border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-800 dark:bg-gray-950 [&:not([data-state])]:hidden"
        onOpenChange={open => {
          if (!open) {
            setLinkMenuOpen(false);
          }
        }}
      >
        <Button
          pressed={items.bold.isActive}
          disabled={!items.bold.canExec}
          onClick={items.bold.command}
          tooltip="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          pressed={items.italic.isActive}
          disabled={!items.italic.canExec}
          onClick={items.italic.command}
          tooltip="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          pressed={items.underline.isActive}
          disabled={!items.underline.canExec}
          onClick={items.underline.command}
          tooltip="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>

        <Button
          pressed={items.strike.isActive}
          disabled={!items.strike.canExec}
          onClick={items.strike.command}
          tooltip="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>

        <Button
          pressed={items.code.isActive}
          disabled={!items.code.canExec}
          onClick={items.code.command}
          tooltip="Code"
        >
          <Code className="h-4 w-4" />
        </Button>

        {items.link.canExec && (
          <Button
            pressed={items.link.isActive}
            onClick={() => {
              items.link.command();
              toggleLinkMenuOpen();
            }}
            tooltip="Link"
          >
            <Link className="h-4 w-4" />
          </Button>
        )}
      </InlinePopover>

      <InlinePopover
        placement={"bottom"}
        defaultOpen={false}
        open={linkMenuOpen}
        onOpenChange={setLinkMenuOpen}
        data-testid="inline-menu-link"
        className="w-xs relative z-10 box-border flex flex-col items-stretch gap-y-2 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-950 [&:not([data-state])]:hidden"
      >
        {linkMenuOpen && (
          <div
            onKeyDown={event => {
              if (event.key === "Enter") {
                event.preventDefault();
                const target = event.target as HTMLInputElement | null;
                const href = target?.value?.trim();
                handleLinkUpdate(href);
              }
            }}
          >
            <input
              placeholder="Paste the link..."
              defaultValue={items.link.currentLink}
              className="box-border flex h-9 w-full rounded-md border border-solid border-gray-200 bg-white px-3 py-2 text-sm outline-none ring-0 ring-transparent transition file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:placeholder:text-gray-500 dark:focus-visible:ring-gray-300"
            />
          </div>
        )}
        {items.link.isActive && (
          <button
            onClick={() => handleLinkUpdate()}
            onMouseDown={event => event.preventDefault()}
            className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md border-0 bg-gray-900 px-3 text-sm font-medium text-gray-50 ring-offset-white transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:ring-offset-gray-950 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
          >
            Remove link
          </button>
        )}
      </InlinePopover>
    </>
  );
}
