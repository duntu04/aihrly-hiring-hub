import { cn } from "@/lib/utils";

type Variant = "advance" | "hold" | "reject" | "submitted" | "info" | "success" | "warning" | "danger";

const styles: Record<Variant, string> = {
  advance: "bg-[color:var(--success)]/12 text-[color:var(--success)]",
  success: "bg-[color:var(--success)]/12 text-[color:var(--success)]",
  hold: "bg-[color:var(--warning)]/15 text-[color:var(--warning)]",
  warning: "bg-[color:var(--warning)]/15 text-[color:var(--warning)]",
  reject: "bg-[color:var(--danger)]/12 text-[color:var(--danger)]",
  danger: "bg-[color:var(--danger)]/12 text-[color:var(--danger)]",
  submitted: "bg-brand-sky text-brand-deep",
  info: "bg-brand-sky text-brand-deep",
};

const labels: Partial<Record<Variant, string>> = {
  advance: "Advance",
  hold: "On hold",
  reject: "Not a fit",
  submitted: "Submitted",
};

export function StatusBadge({
  variant,
  children,
  className,
}: {
  variant: Variant;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.75rem] font-medium",
        styles[variant],
        className,
      )}
    >
      {children ?? labels[variant] ?? variant}
    </span>
  );
}
