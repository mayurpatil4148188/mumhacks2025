import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const mockSchools = [
  { id: "sch-1", name: "Sunrise Public School", city: "Mumbai", students: 520, alerts7d: 4 },
  { id: "sch-2", name: "Horizon Academy", city: "Pune", students: 310, alerts7d: 2 },
];

export default function MasterAdminDashboard() {
  return (
    <DashboardShell
      title="Master Admin"
      description="Manage schools, principals, and platform-wide safety signals."
      nav={[
        { label: "Overview", href: "/dashboard/master-admin" },
        { label: "Schools", href: "/dashboard/master-admin#schools" },
        { label: "Users", href: "/dashboard/master-admin#users" },
      ]}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="p-4">
          <p className="text-sm text-slate-500">Schools onboarded</p>
          <p className="text-3xl font-bold">{mockSchools.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-500">Students</p>
          <p className="text-3xl font-bold">830</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-500">Alerts last 7 days</p>
          <p className="text-3xl font-bold">6</p>
        </Card>
      </div>

      <section id="schools" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Schools</h2>
          <Button asChild>
            <Link href="/dashboard/master-admin/create">Add school</Link>
          </Button>
        </div>
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Students</th>
                <th className="px-4 py-3">Alerts (7d)</th>
              </tr>
            </thead>
            <tbody>
              {mockSchools.map((school) => (
                <tr key={school.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-900">{school.name}</td>
                  <td className="px-4 py-3 text-slate-600">{school.city}</td>
                  <td className="px-4 py-3 text-slate-600">{school.students}</td>
                  <td className="px-4 py-3 text-slate-600">{school.alerts7d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardShell>
  );
}
