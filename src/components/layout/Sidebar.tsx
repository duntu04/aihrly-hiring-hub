import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutGrid, Users, Settings, Lock } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";

const items = [
  { label: "Jobs", icon: LayoutGrid, to: "/jobs", enabled: true },
  { label: "Applicants", icon: Users, to: "/applicants", enabled: false },
  { label: "Settings", icon: Settings, to: "/settings", enabled: false },
];

export function Sidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 gradient-sidebar text-white">
      <div className="px-5 pt-6 pb-8">
        <Logo color="white" />
      </div>

      <nav className="px-3 flex-1 space-y-1">
        {items.map((it) => {
          const Icon = it.icon;
          const active = path.startsWith(it.to);
          if (!it.enabled) {
            return (
              <div
                key={it.label}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/40 cursor-not-allowed"
                title="Coming soon"
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1">{it.label}</span>
                <Lock className="h-3 w-3" />
              </div>
            );
          }
          return (
            <Link
              key={it.label}
              to={it.to}
              className={cn(
                "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white",
              )}
            >
              {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-brand-blue" />}
              <Icon className="h-4 w-4" />
              {it.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 pb-5 pt-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-blue text-white text-sm font-semibold">
            R
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">Recruiter</div>
            <div className="text-[0.7rem] text-white/50">Remotown GmbH</div>
          </div>
          <span className="font-mono text-[0.65rem] text-white/40 px-1.5 py-0.5 rounded bg-white/5">v0.1</span>
        </div>
      </div>
    </aside>
  );
}

export function MobileTabBar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-brand-navy border-t border-white/10 flex">
      {items.map((it) => {
        const Icon = it.icon;
        const active = path.startsWith(it.to);
        const inner = (
          <>
            <Icon className="h-5 w-5" />
            <span className="text-[0.65rem] mt-0.5">{it.label}</span>
          </>
        );
        if (!it.enabled) {
          return (
            <div key={it.label} className="flex-1 flex flex-col items-center py-2.5 text-white/30">
              {inner}
            </div>
          );
        }
        return (
          <Link
            key={it.label}
            to={it.to}
            className={cn(
              "flex-1 flex flex-col items-center py-2.5 transition-colors",
              active ? "text-brand-blue" : "text-white/60",
            )}
          >
            {inner}
          </Link>
        );
      })}
    </nav>
  );
}
