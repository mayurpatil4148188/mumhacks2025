import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { studentNav } from "../nav";
import { Suspense } from "react";
import { BaselineStatus } from "./status";

export default function StudentAssessmentsPage() {
  return (
    <DashboardShell
      title="Assessments"
      description="Choose the check-in you want to start."
      nav={studentNav}
    >
      <Suspense fallback={<div className="text-sm text-slate-600">Loading…</div>}>
        <BaselineStatus />
      </Suspense>
    </DashboardShell>
  );
}
