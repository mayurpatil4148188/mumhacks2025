import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-white/70 shadow-sm">
      <table className={cn("w-full text-sm", className)} {...props} />
    </div>
  );
}

export function THead(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className="bg-slate-50 text-xs uppercase text-slate-500" {...props} />;
}

export function TR(props: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className="border-b last:border-none" {...props} />;
}

export function TH(props: HTMLAttributes<HTMLTableCellElement>) {
  return <th className="px-4 py-3 text-left font-semibold" {...props} />;
}

export function TD(props: HTMLAttributes<HTMLTableCellElement>) {
  return <td className="px-4 py-3" {...props} />;
}
