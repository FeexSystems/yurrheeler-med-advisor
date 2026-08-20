import React from "react";
import { Moon, Sun, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          aria-label="Toggle visual theme (Light, Dark, System)"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-emerald-400" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-lg">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={`text-xs flex items-center gap-2 cursor-pointer ${
            theme === "light" ? "font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/70 dark:bg-slate-800" : "hover:text-emerald-600 dark:hover:text-emerald-400"
          }`}
        >
          <Sun className="h-3.5 w-3.5 text-amber-500" />
          <span>Light Mode</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={`text-xs flex items-center gap-2 cursor-pointer ${
            theme === "dark" ? "font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/70 dark:bg-slate-800" : "hover:text-emerald-600 dark:hover:text-emerald-400"
          }`}
        >
          <Moon className="h-3.5 w-3.5 text-emerald-400" />
          <span>Dark Mode</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={`text-xs flex items-center gap-2 cursor-pointer ${
            theme === "system" ? "font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/70 dark:bg-slate-800" : "hover:text-emerald-600 dark:hover:text-emerald-400"
          }`}
        >
          <Laptop className="h-3.5 w-3.5 text-slate-500" />
          <span>System Theme</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
