import type { EditorExtension } from "./extension";
import { users } from "./user-data";
import { useEditor } from "prosekit/react";
import {
  AutocompleteEmpty,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopover,
} from "prosekit/react/autocomplete";

export default function UserMenu() {
  const editor = useEditor<EditorExtension>();

  const handleUserInsert = (id: number, username: string) => {
    editor.commands.insertMention({
      id: id.toString(),
      value: "@" + username,
      kind: "user",
    });
    editor.commands.insertText({ text: " " });
  };

  return (
    <AutocompletePopover
      regex={/@\w*$/}
      className="relative z-10 box-border block max-h-[25rem] min-w-[15rem] select-none overflow-auto whitespace-nowrap rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-800 dark:bg-gray-950 [&:not([data-state])]:hidden"
    >
      <AutocompleteList>
        <AutocompleteEmpty className="relative box-border flex min-w-[8rem] cursor-default select-none scroll-my-1 items-center justify-between whitespace-nowrap rounded px-3 py-1.5 outline-none data-[focused]:bg-gray-100 dark:data-[focused]:bg-gray-800">
          No results
        </AutocompleteEmpty>

        {users.map(user => (
          <AutocompleteItem
            key={user.id}
            className="relative box-border flex min-w-[8rem] cursor-default select-none scroll-my-1 items-center justify-between whitespace-nowrap rounded px-3 py-1.5 outline-none data-[focused]:bg-gray-100 dark:data-[focused]:bg-gray-800"
            onSelect={() => handleUserInsert(user.id, user.name)}
          >
            {user.name}
          </AutocompleteItem>
        ))}
      </AutocompleteList>
    </AutocompletePopover>
  );
}
