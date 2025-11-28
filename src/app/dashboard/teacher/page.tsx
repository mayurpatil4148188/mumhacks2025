import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { demoStudents } from "@/lib/data";

const studentRisk = {
  "stu-1": { risk: 2, domain: "Bullying" },
  "stu-2": { risk: 1, domain: "Academic pressure" },
};

export default function TeacherDashboard() {
  return (
    <DashboardShell
      title="Teacher overview"
      description="See assigned classes, start assessments, and follow up on alerts."
      nav={[
        { label: "Dashboard", href: "/dashboard/teacher" },
        { label: "Classes", href: "/dashboard/teacher/classes" },
        { label: "Alerts", href: "/dashboard/teacher/alerts" },
      ]}
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-4 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Students</h2>
            <Button asChild size="sm">
              <Link href="/dashboard/teacher/start">Start assessment</Link>
            </Button>
          </div>
          <div className="space-y-3">
            {demoStudents.map((student) => {
              const risk = studentRisk[student.id as keyof typeof studentRisk];
              return (
                <div
                  key={student.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{student.name}</p>
                    <p className="text-xs text-slate-500">
                      Grade {student.grade} · Section {student.section}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={risk?.risk === 2 ? "warning" : "default"}>
                      {risk ? `${risk.domain} · risk ${risk.risk}` : "No flags"}
                    </Badge>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/dashboard/teacher/students/${student.id}`}>Details</Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-slate-900">Actions</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>• Launch baseline for a class</li>
            <li>• Review pending alerts</li>
            <li>• Add teacher observation</li>
            <li>• Chat with MITR assistant</li>
          </ul>
        </Card>
      </div>
    </DashboardShell>
  );
}
