import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { demoStudents } from "@/lib/data";

export default function ParentDashboard() {
  return (
    <DashboardShell
      title="Parent view"
      description="See gentle updates about your children and teacher observations."
      nav={[
        { label: "Overview", href: "/dashboard/parent" },
        { label: "Notes", href: "/dashboard/parent/notes" },
      ]}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {demoStudents.map((student) => (
          <Card key={student.id} className="space-y-3 p-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">{student.name}</p>
              <p className="text-xs text-slate-500">
                Grade {student.grade} · Section {student.section}
              </p>
            </div>
            <div className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              We are monitoring overall well-being and keeping routines balanced. Teachers will
              reach out if any support is needed.
            </div>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}
