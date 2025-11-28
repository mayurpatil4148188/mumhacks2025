import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SignOutButton } from "./sign-out-button";

interface NavItem {
  label: string;
  href: string;
}

export function DashboardShell({
  title,
  description,
  nav,
  children,
}: {
  title: string;
  description?: string;
  nav: NavItem[];
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-64 border-r border-slate-200 bg-white/80 p-6 shadow-sm md:block">
        <div className="mb-6 space-y-1">
          <p className="text-xs uppercase tracking-widest text-emerald-600">Mitr</p>
          <p className="text-lg font-semibold text-slate-900">Well-Being Portal</p>
        </div>
        <nav className="space-y-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 border-t border-slate-200 pt-4">
          <SignOutButton />
        </div>
      </aside>
      <main className="flex-1 space-y-6 p-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          {description ? <p className="text-sm text-slate-600">{description}</p> : null}
        </div>
        {children}
      </main>
    </div>
  );
}
