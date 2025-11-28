import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { studentNav } from "../nav";
import { Suspense } from "react";
import { BaselineStatus } from "./status";
import { isDummyMode } from "@/lib/env";
import { dummyUserPrincipal, dummyUserStudent } from "@/lib/dummy-data";

export default function StudentAssessmentsPage() {
  return (
    <DashboardShell
      title="Assessments"
      description="Choose the check-in you want to start."
      nav={studentNav}
    >
      {isDummyMode() ? (
        <Card className="border-amber-200 bg-amber-50 p-4 text-sm text-slate-800">
          <p className="font-semibold text-amber-800">Dummy mode</p>
          <p className="text-xs text-slate-700">
            Use these credentials in dummy mode: Principal {dummyUserPrincipal.email} / {dummyUserPrincipal.password} • Student {dummyUserStudent.email} / {dummyUserStudent.password}
          </p>
        </Card>
      ) : null}
      <Suspense fallback={<div className="text-sm text-slate-600">Loading…</div>}>
        <BaselineStatus />
      </Suspense>
    </DashboardShell>
  );
}
