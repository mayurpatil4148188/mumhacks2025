import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StudentDashboard() {
  return (
    <DashboardShell
      title="Student home"
      description="Simple check-ins to help you feel heard."
      nav={[
        { label: "Home", href: "/dashboard/student" },
        { label: "Assessments", href: "/dashboard/student/assessments" },
      ]}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-4 p-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Baseline check-in</h2>
            <p className="text-sm text-slate-600">Takes about 5 minutes, 25 friendly questions.</p>
          </div>
          <Button asChild>
            <a href="/dashboard/student/assessments/start?type=baseline">Start baseline</a>
          </Button>
        </Card>
        <Card className="space-y-4 p-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Follow-up check-in</h2>
            <p className="text-sm text-slate-600">Quick adaptive questions tailored for you.</p>
          </div>
          <Button variant="outline" asChild>
            <a href="/dashboard/student/assessments/start?type=followup">Start follow-up</a>
          </Button>
        </Card>
      </div>
    </DashboardShell>
  );
}
