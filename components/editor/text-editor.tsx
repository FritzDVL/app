import { useCallback, useMemo, useState } from "react";
import { defineExtension } from "./extension";
import "./text-editor.css";
import BlockHandle from "@/components/editor/block-handle";
import InlineMenu from "@/components/editor/inline-menu";
import MentionPicker from "@/components/editor/mention-picker";
import SlashMenu from "@/components/editor/slash-menu";
import { TableHandle } from "@/components/editor/table-handle";
import Toolbar from "@/components/editor/toolbar";
import { htmlFromMarkdown, markdownFromHTML } from "@/lib/external/prosekit/markdown";
import "prosekit/basic/style.css";
import "prosekit/basic/typography.css";
import { NodeJSON, createEditor, jsonFromHTML } from "prosekit/core";
import { ProseKit, useDocChange } from "prosekit/react";

interface TextEditorProps {
  onChange: (value: string) => void;
  initialValue?: string;
}

export function TextEditor({ onChange, initialValue }: TextEditorProps) {
  let defaultContent: NodeJSON | undefined;
  const editor = useMemo(() => {
    if (initialValue) {
      const html = htmlFromMarkdown(initialValue);
      const extension = defineExtension();
      if (!extension.schema) {
        throw new Error("Extension schema is null");
      }
      const content = jsonFromHTML(html, { schema: extension.schema });
      defaultContent = content;
    }

    const extension = defineExtension();
    return createEditor({
      extension,
      defaultContent,
    });
  }, [initialValue]);

  useDocChange(
    () => {
      const html = editor.getDocHTML();
      const record = markdownFromHTML(html);
      onChange(record);
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
          <MentionPicker />
        </div>
      </div>
    </ProseKit>
  );
}
