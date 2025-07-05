import { defineBaseKeymap } from "prosekit/core";
import { union } from "prosekit/core";
import { defineBold } from "prosekit/extensions/bold";
import { defineDoc } from "prosekit/extensions/doc";
import { defineList } from "prosekit/extensions/list";
import { defineParagraph } from "prosekit/extensions/paragraph";
import { defineText } from "prosekit/extensions/text";

export function defineExtension() {
  return union(defineBaseKeymap(), defineDoc(), defineText(), defineParagraph(), defineBold(), defineList());
}

export type EditorExtension = ReturnType<typeof defineExtension>;
