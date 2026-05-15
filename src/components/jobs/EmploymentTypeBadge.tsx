import type { EmploymentType } from "@/types";
import { cn } from "@/lib/utils";

const styles: Record<EmploymentType, string> = {
  NSS: "bg-brand-sky text-brand-deep",
  "Full-time": "bg-[color:var(--success)]/12 text-[color:var(--success)]",
  Internship: "bg-[color:var(--warning)]/15 text-[color:var(--warning)]",
  "Part-time": "bg-violet-100 text-violet-700",
};

export function EmploymentTypeBadge({ type, className }: { type: EmploymentType; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wide",
        styles[type],
        className,
      )}
    >
      {type}
    </span>
  );
}
