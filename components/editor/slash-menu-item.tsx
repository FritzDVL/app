import { AutocompleteItem } from "prosekit/react/autocomplete";

export default function SlashMenuItem(props: { label: string; kbd?: string; onSelect: () => void }) {
  return (
    <AutocompleteItem
      onSelect={props.onSelect}
      className="relative box-border flex min-w-[8rem] cursor-default select-none scroll-my-1 items-center justify-between whitespace-nowrap rounded px-3 py-1.5 outline-none data-[focused]:bg-gray-100 dark:data-[focused]:bg-gray-800"
    >
      <span>{props.label}</span>
      {props.kbd && <kbd className="font-mono text-xs text-gray-400 dark:text-gray-500">{props.kbd}</kbd>}
    </AutocompleteItem>
  );
}
