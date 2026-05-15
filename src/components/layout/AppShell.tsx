import type { ReactNode } from "react";
import { Sidebar, MobileTabBar } from "./Sidebar";
import { TopBar, type Crumb } from "./TopBar";

export function AppShell({
  crumbs,
  action,
  children,
}: {
  crumbs: Crumb[];
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar crumbs={crumbs} action={action} />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pb-24 md:pb-8">{children}</main>
      </div>
      <MobileTabBar />
    </div>
  );
}
