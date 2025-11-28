import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mockAlerts = [
  { id: "a1", student: "Aarav Shah", domain: "Bullying", level: "RED" },
  { id: "a2", student: "Diya Menon", domain: "Academic pressure", level: "YELLOW" },
];

export default function PrincipalDashboard() {
  return (
    <DashboardShell
      title="Principal overview"
      description="Monitor your school across classes, risk domains, and staff actions."
      nav={[
        { label: "Overview", href: "/dashboard/principal" },
        { label: "Classes", href: "/dashboard/principal/classes" },
        { label: "Staff", href: "/dashboard/principal/staff" },
      ]}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <p className="text-sm text-slate-500">Active alerts</p>
          <p className="text-3xl font-bold">{mockAlerts.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-500">Average risk score</p>
          <p className="text-3xl font-bold">1.2</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-500">Classes covered</p>
          <p className="text-3xl font-bold">12</p>
        </Card>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Recent alerts</h2>
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Domain</th>
                <th className="px-4 py-3">Level</th>
              </tr>
            </thead>
            <tbody>
              {mockAlerts.map((alert) => (
                <tr key={alert.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-900">{alert.student}</td>
                  <td className="px-4 py-3 text-slate-600">{alert.domain}</td>
                  <td className="px-4 py-3">
                    <Badge variant={alert.level === "RED" ? "danger" : "warning"}>{alert.level}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardShell>
  );
}
