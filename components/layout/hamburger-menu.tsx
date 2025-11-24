"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CATEGORIES, TAGS } from "@/lib/shared/categories";
import { Menu } from "lucide-react";

export function HamburgerMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Navigation Links */}
          <nav className="space-y-1">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <span>📋</span>
              <span>Topics</span>
            </Link>
            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <span>💬</span>
              <span>My messages</span>
            </Link>
            <Link
              href="/about"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <span>ℹ️</span>
              <span>About</span>
            </Link>
          </nav>

          {/* Categories Section */}
          <div>
            <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Categories
            </h3>
            <div className="space-y-1">
              {CATEGORIES.map(category => (
                <Link
                  key={category.id}
                  href={`/?category=${category.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <span className={`h-2 w-2 rounded-sm ${category.color}`} />
                  <span className="text-gray-700 dark:text-gray-300">{category.label}</span>
                </Link>
              ))}
              <Link
                href="/?category=all"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <span>☰</span>
                <span>All categories</span>
              </Link>
            </div>
          </div>

          {/* Tags Section */}
          <div>
            <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Tags
            </h3>
            <div className="space-y-1">
              {TAGS.map(tag => (
                <Link
                  key={tag.id}
                  href={`/?tag=${tag.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${tag.color}`} />
                  <span className="text-gray-700 dark:text-gray-300">{tag.label}</span>
                </Link>
              ))}
              <Link
                href="/?tag=all"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <span>☰</span>
                <span>All tags</span>
              </Link>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
