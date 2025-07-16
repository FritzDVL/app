import { useMemo } from "react";
import { defineExtension } from "./extension";
import "./text-editor.css";
import BlockHandle from "@/components/editor/block-handle";
import InlineMenu from "@/components/editor/inline-menu";
import SlashMenu from "@/components/editor/slash-menu";
import { TableHandle } from "@/components/editor/table-handle";
import Toolbar from "@/components/editor/toolbar";
import { markdownFromHTML } from "@/lib/prosekit/markdown";
import "prosekit/basic/style.css";
import "prosekit/basic/typography.css";
import { createEditor } from "prosekit/core";
import { ProseKit, useDocChange } from "prosekit/react";

interface TextEditorProps {
  onChange: (value: string) => void;
}

export function TextEditor({ onChange }: TextEditorProps) {
  const editor = useMemo(() => {
    return createEditor({ extension: defineExtension() });
  }, []);

  // Listen for content changes
  useDocChange(
    () => {
      const html = editor.getDocHTML();
      const record = markdownFromHTML(html);
      onChange(record);
      // onChange(html); // fallback to HTML for now
    },
    { editor },
  );

  return (
    <ProseKit editor={editor}>
      <div className="color-black dark:color-white box-border flex h-full min-h-36 w-full flex-col overflow-x-hidden overflow-y-hidden rounded-md border border-solid border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-700">
        <Toolbar />
        <div className="relative box-border w-full flex-1 overflow-y-scroll">
          <div
            ref={editor.mount}
            className="ProseMirror box-border min-h-full px-[max(4rem,_calc(50%-20rem))] py-8 outline-none outline-0 [&_span[data-mention=tag]]:text-violet-500 [&_span[data-mention=user]]:text-blue-500"
          ></div>
          <InlineMenu />
          <SlashMenu />
          <BlockHandle />
          <TableHandle />
        </div>
      </div>
    </ProseKit>
  );
}
