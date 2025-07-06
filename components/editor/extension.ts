import CodeBlockView from "@/components/editor/code-block-view";
import { defineBasicExtension } from "prosekit/basic";
import { defineBaseKeymap } from "prosekit/core";
import { union } from "prosekit/core";
import { defineBold } from "prosekit/extensions/bold";
import { ShikiBundledLanguage, defineCodeBlock, defineCodeBlockShiki } from "prosekit/extensions/code-block";
import { defineDoc } from "prosekit/extensions/doc";
import { defineHeading } from "prosekit/extensions/heading";
import { defineItalic } from "prosekit/extensions/italic";
import { defineList } from "prosekit/extensions/list";
import { defineParagraph } from "prosekit/extensions/paragraph";
import { defineText } from "prosekit/extensions/text";
import { defineUnderline } from "prosekit/extensions/underline";
import { type ReactNodeViewComponent, defineReactNodeView } from "prosekit/react";

// Define the configured languages
export const CONFIGURED_LANGUAGES = [
  { id: "javascript" as ShikiBundledLanguage, name: "JavaScript" },
  { id: "typescript" as ShikiBundledLanguage, name: "TypeScript" },
  { id: "python" as ShikiBundledLanguage, name: "Python" },
  { id: "java" as ShikiBundledLanguage, name: "Java" },
  { id: "csharp" as ShikiBundledLanguage, name: "C#" },
  { id: "php" as ShikiBundledLanguage, name: "PHP" },
  { id: "ruby" as ShikiBundledLanguage, name: "Ruby" },
  { id: "go" as ShikiBundledLanguage, name: "Go" },
  { id: "rust" as ShikiBundledLanguage, name: "Rust" },
  { id: "kotlin" as ShikiBundledLanguage, name: "Kotlin" },
  { id: "swift" as ShikiBundledLanguage, name: "Swift" },
  { id: "html" as ShikiBundledLanguage, name: "HTML" },
  { id: "css" as ShikiBundledLanguage, name: "CSS" },
  { id: "json" as ShikiBundledLanguage, name: "JSON" },
  { id: "yaml" as ShikiBundledLanguage, name: "YAML" },
  { id: "xml" as ShikiBundledLanguage, name: "XML" },
];

export function defineExtension() {
  return union(
    defineBasicExtension(),
    defineBaseKeymap(),
    defineDoc(),
    defineText(),
    defineParagraph(),
    defineItalic(),
    defineUnderline(),
    defineBold(),
    defineList(),
    defineHeading(),
    defineCodeBlock(),
    defineCodeBlockShiki({
      themes: ["one-dark-pro"],
      langs: CONFIGURED_LANGUAGES.map(lang => lang.id),
    }),
    defineReactNodeView({
      name: "codeBlock",
      contentAs: "code",
      component: CodeBlockView satisfies ReactNodeViewComponent,
    }),
  );
}

export type EditorExtension = ReturnType<typeof defineExtension>;
