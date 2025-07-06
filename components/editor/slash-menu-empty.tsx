import { AutocompleteEmpty } from "prosekit/react/autocomplete";

export default function SlashMenuEmpty() {
  return (
    <AutocompleteEmpty className="relative box-border flex min-w-[8rem] cursor-default select-none scroll-my-1 items-center justify-between whitespace-nowrap rounded px-3 py-1.5 outline-none data-[focused]:bg-gray-100 dark:data-[focused]:bg-gray-800">
      <span>No results</span>
    </AutocompleteEmpty>
  );
}
