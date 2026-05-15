import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void; icon?: ReactNode };
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-sky text-brand-deep">
        {icon}
      </div>
      <h3 className="font-display text-xl font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-text-secondary">{description}</p>
      {action && (
        <Button onClick={action.onClick} className="mt-6 gap-1.5">
          {action.icon}
          {action.label}
        </Button>
      )}
    </div>
  );
}
