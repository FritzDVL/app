"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import useAccountSearch, { AccountSuggestion } from "@/hooks/editor/use-account-search";
import { Search, User } from "lucide-react";

interface UserSearchProps {
  onUserSelect: (user: AccountSuggestion) => void;
  placeholder?: string;
  disabled?: boolean;
  excludeAddresses?: string[];
}

export function UserSearch({
  onUserSelect,
  placeholder = "Search for a user...",
  disabled = false,
  excludeAddresses = [],
}: UserSearchProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const searchResults = useAccountSearch(searchQuery);
  const filteredResults = searchResults.filter(
    user => !excludeAddresses.some(addr => addr.toLowerCase() === user.address.toLowerCase()),
  );

  const isSearching = searchQuery.length > 0 && searchResults.length === 0;

  const handleUserSelect = (user: AccountSuggestion) => {
    onUserSelect(user);
    setSearchQuery("");
    setOpen(false);
  };

  const handleInputFocus = () => {
    setOpen(true);
  };

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    if (value.length > 0) {
      setOpen(true);
    }
  };

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative" ref={inputRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={e => handleInputChange(e.target.value)}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="rounded-xl pl-10"
          disabled={disabled}
        />
      </div>

      {open && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-xl border border-gray-200/80 bg-white/95 p-2 shadow-xl backdrop-blur-md dark:border-gray-700/80 dark:bg-gray-900/95">
          <Command className="rounded-xl">
            <CommandList className="max-h-80">
              {searchQuery.length === 0 ? (
                <div className="flex items-center justify-center rounded-xl bg-brand-50/40 py-8 text-sm text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                  <div className="flex flex-col items-center gap-3">
                    <div className="rounded-full bg-brand-100 p-3 ring-1 ring-brand-200/50 dark:bg-brand-900/50 dark:ring-brand-800/50">
                      <Search className="h-5 w-5 text-brand-500 dark:text-brand-400" />
                    </div>
                    <div className="text-center">
                      <span className="font-medium">Type to search users</span>
                      <p className="mt-1 text-xs text-brand-500/70">Start typing to find users to add</p>
                    </div>
                  </div>
                </div>
              ) : filteredResults.length === 0 ? (
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
                  <CommandEmpty className="flex items-center justify-center rounded-xl bg-gray-50/60 py-8 text-sm text-gray-500 dark:bg-gray-800/60 dark:text-gray-400">
                    <div className="flex flex-col items-center gap-3">
                      <User className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                      <div className="text-center">
                        <span className="font-medium">No users found</span>
                        <p className="mt-1 text-xs text-gray-400">Try a different search term</p>
                      </div>
                    </div>
                  </CommandEmpty>
                )
              ) : (
                <CommandGroup>
                  {filteredResults.map(user => (
                    <CommandItem
                      key={user.address}
                      onSelect={() => handleUserSelect(user)}
                      className="flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-100 data-[selected=true]:bg-gray-100 dark:hover:bg-gray-800 dark:data-[selected=true]:bg-gray-800"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.picture || "/placeholder.svg"} alt={user.name || user.username} />
                        <AvatarFallback className="bg-gradient-to-r from-brand-400 to-brand-600 text-xs text-white">
                          {(user.name || user.username || "U").slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-foreground">
                          {user.name || user.displayUsername || "Unknown User"}
                        </p>
                        <p className="truncate text-sm text-muted-foreground">
                          @{user.displayUsername} • {user.address.slice(0, 6)}...{user.address.slice(-4)}
                        </p>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}
