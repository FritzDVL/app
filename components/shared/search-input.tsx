"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [text, setText] = useState(initialQuery);
  const [query] = useDebounce(text, 500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    router.push(`/?${params.toString()}`);
  }, [query, router, searchParams]);

  return (
    <div className="relative w-full max-w-xs">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-gray-400" />
      <Input
        type="search"
        placeholder="Search threads..."
        className="h-9 w-full rounded-full bg-slate-100 pl-9 text-sm focus:bg-white dark:bg-gray-800 dark:focus:bg-gray-900"
        value={text}
        onChange={e => setText(e.target.value)}
      />
    </div>
  );
}
