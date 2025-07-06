import type { EditorExtension } from "./extension";
import { tags } from "./tag-data";
import { useEditor } from "prosekit/react";
import {
  AutocompleteEmpty,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopover,
} from "prosekit/react/autocomplete";

export default function TagMenu() {
  const editor = useEditor<EditorExtension>();

  const handleTagInsert = (id: number, label: string) => {
    editor.commands.insertMention({
      id: id.toString(),
      value: "#" + label,
      kind: "tag",
    });
    editor.commands.insertText({ text: " " });
  };

  return (
    <AutocompletePopover
      regex={/#[\da-z]*$/i}
      className="relative z-10 box-border block max-h-[25rem] min-w-[15rem] select-none overflow-auto whitespace-nowrap rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-800 dark:bg-gray-950 [&:not([data-state])]:hidden"
    >
      <AutocompleteList>
        <AutocompleteEmpty className="relative box-border flex min-w-[8rem] cursor-default select-none scroll-my-1 items-center justify-between whitespace-nowrap rounded px-3 py-1.5 outline-none data-[focused]:bg-gray-100 dark:data-[focused]:bg-gray-800">
          No results
        </AutocompleteEmpty>

        {tags.map(tag => (
          <AutocompleteItem
            key={tag.id}
            className="relative box-border flex min-w-[8rem] cursor-default select-none scroll-my-1 items-center justify-between whitespace-nowrap rounded px-3 py-1.5 outline-none data-[focused]:bg-gray-100 dark:data-[focused]:bg-gray-800"
            onSelect={() => handleTagInsert(tag.id, tag.label)}
          >
            #{tag.label}
          </AutocompleteItem>
        ))}
      </AutocompleteList>
    </AutocompletePopover>
  );
}
