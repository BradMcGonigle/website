"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const themes = [
  { value: "system", label: "System", icon: Monitor },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 rounded-full border border-border bg-muted/50 p-1">
        <div className="h-7 w-7" />
        <div className="h-7 w-7" />
        <div className="h-7 w-7" />
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-1 rounded-full border border-border bg-muted/50 p-1"
      role="radiogroup"
      aria-label="Select theme"
    >
      {themes.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={theme === value}
          aria-label={label}
          onClick={() => setTheme(value)}
          className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
            theme === value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
