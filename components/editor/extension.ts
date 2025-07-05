import { defineBaseKeymap } from "prosekit/core";
import { union } from "prosekit/core";
import { defineBold } from "prosekit/extensions/bold";
import { defineDoc } from "prosekit/extensions/doc";
import { defineHeading } from "prosekit/extensions/heading";
import { defineItalic } from "prosekit/extensions/italic";
import { defineList } from "prosekit/extensions/list";
import { defineParagraph } from "prosekit/extensions/paragraph";
import { defineText } from "prosekit/extensions/text";
import { defineUnderline } from "prosekit/extensions/underline";

export function defineExtension() {
  return union(
    defineBaseKeymap(),
    defineDoc(),
    defineText(),
    defineParagraph(),
    defineItalic(),
    defineUnderline(),
    defineBold(),
    defineList(),
    defineHeading(),
  );
}

export type EditorExtension = ReturnType<typeof defineExtension>;
