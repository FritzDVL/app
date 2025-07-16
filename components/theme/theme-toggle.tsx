"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === "dark";
  const handleToggle = () => setTheme(isDark ? "light" : "dark");

  return (
    <Button variant="yellow" size="icon" className="h-10 w-10" aria-label="Toggle theme" onClick={handleToggle}>
      {mounted ? isDark ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" /> : null}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
