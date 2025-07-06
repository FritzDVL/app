import { useState } from "react";
import Image from "next/image";
import type { EditorExtension } from "./extension";
import useMentionQuery, { MentionAccount } from "@/hooks/use-mention-query";
import { Check, ChevronRight, Search, Users } from "lucide-react";
import { useEditor } from "prosekit/react";
import {
  AutocompleteEmpty,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopover,
} from "prosekit/react/autocomplete";

interface MentionItemProps {
  onSelect: VoidFunction;
  account: MentionAccount;
}

const MentionItem = ({ onSelect, account }: MentionItemProps) => {
  return (
    <AutocompleteItem
      className="group flex w-full max-w-xs cursor-pointer items-center gap-2 rounded-md border border-transparent bg-white/60 px-1.5 py-1 transition-all duration-150 hover:border-brand-200/60 hover:bg-brand-50/70 hover:shadow-sm data-[focused]:border-brand-300/80 data-[selected]:border-brand-400 data-[focused]:bg-brand-50 data-[selected]:bg-brand-100/80 data-[selected]:text-brand-900 data-[focused]:shadow-md dark:bg-gray-800/60 dark:hover:border-brand-400/30 dark:hover:bg-gray-700/70 dark:data-[focused]:border-brand-400/50 dark:data-[selected]:border-brand-400 dark:data-[focused]:bg-gray-700/80 dark:data-[selected]:bg-brand-900/60 dark:data-[selected]:text-brand-100"
      onSelect={onSelect}
    >
      <div className="relative flex-shrink-0">
        <Image
          alt={account.displayUsername}
          className="h-6 w-6 rounded-full border border-white bg-gray-100 object-cover shadow-sm ring-1 ring-brand-100/40 group-hover:border-brand-200 group-hover:ring-brand-200/60 group-data-[focused]:border-brand-300 group-data-[focused]:ring-brand-300/70 dark:border-gray-600 dark:ring-gray-600/30"
          height="24"
          src={account.picture}
          width="24"
        />
        {/* Online indicator, smaller */}
        <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-white bg-brand-500 ring-1 ring-brand-200/40 dark:border-gray-800 dark:ring-gray-600/30" />
      </div>
      <span className="truncate text-xs font-medium text-gray-900 group-hover:text-brand-700 group-data-[focused]:text-brand-800 dark:text-white dark:group-hover:text-brand-300 dark:group-data-[focused]:text-brand-200">
        {account.name}
        <span className="block truncate text-[11px] font-normal text-gray-500 group-hover:text-gray-600 group-data-[focused]:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300 dark:group-data-[focused]:text-gray-200">
          @{account.displayUsername}
        </span>
      </span>
      {/* Verified badge, smaller */}
      <span className="flex-shrink-0 rounded bg-brand-500/10 p-0.5 ring-1 ring-brand-500/10">
        <Check className="h-2 w-2 text-brand-600 dark:text-brand-400" strokeWidth={3} />
      </span>
      {/* Arrow indicator, smaller */}
      <span className="flex-shrink-0 pl-1">
        <ChevronRight className="h-2.5 w-2.5 text-gray-300 group-hover:text-brand-400 group-data-[focused]:text-brand-500 dark:text-gray-500 dark:group-hover:text-brand-400" />
      </span>
    </AutocompleteItem>
  );
};

export default function MentionPicker() {
  const [queryString, setQueryString] = useState<string>("");
  const editor = useEditor<EditorExtension>();

  const result = useMentionQuery(queryString);
  const isSearching = queryString.length > 0 && result.length === 0;

  const handleAccountInsert = (account: MentionAccount) => {
    editor.commands.insertMention({
      id: account.address,
      value: "@" + account.displayUsername,
      kind: "account",
    });
    editor.commands.insertText({ text: " " });
  };

  return (
    <AutocompletePopover
      regex={/@\w*$/}
      offset={10}
      onQueryChange={setQueryString}
      className="relative z-50 min-w-[14rem] max-w-md select-none overflow-hidden rounded-xl border border-gray-200/80 bg-white/95 p-2 shadow-xl backdrop-blur-md dark:border-gray-700/80 dark:bg-gray-900/95 [&:not([data-state])]:hidden"
    >
      <AutocompleteList className="max-h-80 space-y-1 overflow-y-auto">
        {queryString.length > 0 && result.length === 0 ? (
          isSearching ? (
            <div className="flex items-center justify-center rounded-xl bg-brand-50/30 py-8 text-sm text-brand-600 dark:bg-brand-900/20 dark:text-brand-400">
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-500"></div>
                  <Search className="absolute inset-0 m-auto h-4 w-4 text-brand-400" />
                </div>
                <span className="font-medium">Searching users...</span>
              </div>
            </div>
          ) : (
            <AutocompleteEmpty className="flex items-center justify-center rounded-xl bg-gray-50/60 py-8 text-sm text-gray-500 dark:bg-gray-800/60 dark:text-gray-400">
              <div className="flex flex-col items-center gap-3">
                <Users className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                <div className="text-center">
                  <span className="font-medium">No users found</span>
                  <p className="mt-1 text-xs text-gray-400">Try a different search term</p>
                </div>
              </div>
            </AutocompleteEmpty>
          )
        ) : queryString.length === 0 ? (
          <div className="flex items-center justify-center rounded-xl bg-brand-50/40 py-8 text-sm text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
            <div className="flex flex-col items-center gap-3">
              <div className="rounded-full bg-brand-100 p-3 ring-1 ring-brand-200/50 dark:bg-brand-900/50 dark:ring-brand-800/50">
                <Search className="h-5 w-5 text-brand-500 dark:text-brand-400" />
              </div>
              <div className="text-center">
                <span className="font-medium">Type to search users</span>
                <p className="mt-1 text-xs text-brand-500/70">Start typing to find users to mention</p>
              </div>
            </div>
          </div>
        ) : (
          result.map(account => (
            <MentionItem account={account} key={account.address} onSelect={() => handleAccountInsert(account)} />
          ))
        )}
      </AutocompleteList>
    </AutocompletePopover>
  );
}
