import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";

export interface Crumb {
  label: string;
  to?: string;
}

export function TopBar({ crumbs, action }: { crumbs: Crumb[]; action?: ReactNode }) {
  const { theme, toggle } = useTheme();
  return (
    <header className="sticky top-0 z-20 h-14 bg-card/80 backdrop-blur border-b border-border flex items-center px-5 gap-3">
      <nav className="flex items-center gap-1.5 text-sm min-w-0 flex-1">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <span key={i} className="flex items-center gap-1.5 min-w-0">
              {c.to && !last ? (
                <Link to={c.to} className="text-text-secondary hover:text-foreground transition-colors truncate">
                  {c.label}
                </Link>
              ) : (
                <span className={last ? "font-medium text-foreground truncate" : "text-text-secondary truncate"}>
                  {c.label}
                </span>
              )}
              {!last && <ChevronRight className="h-3.5 w-3.5 text-text-muted shrink-0" />}
            </span>
          );
        })}
      </nav>
      <div className="flex items-center gap-2 shrink-0">
        <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
        {action}
      </div>
    </header>
  );
}
