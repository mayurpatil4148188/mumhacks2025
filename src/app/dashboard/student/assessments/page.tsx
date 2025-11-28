import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { studentNav } from "../nav";

export default function StudentAssessmentsPage() {
  return (
    <DashboardShell
      title="Assessments"
      description="Choose the check-in you want to start."
      nav={studentNav}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-4 p-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Baseline check-in</h2>
            <p className="text-sm text-slate-600">
              A quick set of questions to understand how you are feeling overall.
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/student/assessments/start?type=baseline">Start baseline</Link>
          </Button>
        </Card>
        <Card className="space-y-4 p-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Follow-up check-in</h2>
            <p className="text-sm text-slate-600">
              Short follow-up on areas that need a bit more attention.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/dashboard/student/assessments/start?type=followup">Start follow-up</Link>
          </Button>
        </Card>
      </div>
    </DashboardShell>
  );
}
