// Converts <span data-mention="user" data-id="accountname">@accountname</span> to [@accountname](mention:user:accountname) in Markdown
import type { Element, Parent } from "hast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

export const rehypeMentionToMarkdownLink: Plugin = () => (tree: any) => {
  function isElement(node: any): node is Element {
    return node && typeof node === "object" && node.type === "element" && typeof node.tagName === "string";
  }
  visit(tree, "element", (node: Element, index: number | undefined, parent: Parent | null) => {
    // Only convert if parent is not already a link (avoid double conversion)
    const isInsideLink = parent && isElement(parent) && parent.tagName === "a";
    if (isInsideLink) return;

    if (
      node.tagName === "span" &&
      node.properties &&
      node.properties["data-mention"] === "user" &&
      node.properties["data-id"]
    ) {
      const account = node.properties["data-id"];
      if (parent && Array.isArray(parent.children) && typeof index === "number") {
        parent.children[index] = {
          type: "element",
          tagName: "a",
          properties: {
            href: `mention:user:${account}`,
          },
          children: [{ type: "text", value: `@${account}` }],
        };
      }
    } else if (
      node.tagName === "span" &&
      node.properties &&
      node.properties["data-mention"] === "tag" &&
      node.properties["data-id"]
    ) {
      const tag = node.properties["data-id"];
      if (parent && Array.isArray(parent.children) && typeof index === "number") {
        parent.children[index] = {
          type: "element",
          tagName: "a",
          properties: {
            href: `mention:tag:${tag}`,
          },
          children: [{ type: "text", value: `#${tag}` }],
        };
      }
    }
  });
};
