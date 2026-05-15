import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  label: string;
}

export function StepIndicator({ steps, current }: { steps: Step[]; current: number }) {
  return (
    <ol className="flex items-center gap-2 sm:gap-4 w-full">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={s.label} className="flex items-center gap-2 sm:gap-4 flex-1 last:flex-none">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all",
                  done && "bg-primary text-primary-foreground",
                  active && "bg-card text-primary ring-2 ring-primary",
                  !done && !active && "bg-muted text-text-muted",
                )}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-sm font-medium hidden sm:inline truncate",
                  (done || active) ? "text-foreground" : "text-text-muted",
                )}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn("h-px flex-1 transition-colors", done ? "bg-primary" : "bg-border")} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
