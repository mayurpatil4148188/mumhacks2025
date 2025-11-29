import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAuthSession } from "@/lib/auth";
import { dbConnect } from "@/db/connection";
import { User } from "@/models/User";
import { principalNav } from "../nav";
import { isDummyMode } from "@/lib/env";
import { dummyStaff } from "@/lib/dummy-data";
import { Mail, Users, AlertCircle, Clock } from "lucide-react";

export default async function PrincipalStaffPage() {
  const session = await getAuthSession();
  if (!session || !session.user.schoolId) {
    throw new Error("Unauthorized or school not found.");
  }

  let staff: any[] = [];

  if (isDummyMode()) {
    staff = dummyStaff;
  } else {
    await dbConnect();
    const schoolId = session.user.schoolId;
    const users = await User.find({ schoolId, role: { $in: ["TEACHER", "COUNSELOR"] } })
      .select("_id name email role")
      .lean();
    staff = users.map((u) => ({
      id: u._id.toString(),
      name: u.name || "Staff Member",
      email: u.email,
      role: u.role,
      assignedClasses: [],
      studentsCount: 0,
      alertsHandled: 0,
      lastActive: new Date(),
    }));
  }

  return (
    <DashboardShell
      title="Staff"
      description="Manage and monitor your teaching staff and counselors."
      nav={principalNav}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <p className="text-sm text-slate-500">Total staff</p>
          <p className="text-3xl font-bold">{staff.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-500">Teachers</p>
          <p className="text-3xl font-bold">{staff.filter((s) => s.role === "TEACHER").length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-500">Counselors</p>
          <p className="text-3xl font-bold">{staff.filter((s) => s.role === "COUNSELOR").length}</p>
        </Card>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Staff members</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {staff.map((member) => (
            <Card key={member.id} className="space-y-3 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{member.name}</h3>
                  <Badge variant={member.role === "TEACHER" ? "default" : "success"} className="mt-1">
                    {member.role}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="h-4 w-4" />
                  <span>{member.email}</span>
                </div>
                {member.assignedClasses && member.assignedClasses.length > 0 && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Users className="h-4 w-4" />
                    <span>Classes: {member.assignedClasses.join(", ")}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-600">
                  <Users className="h-4 w-4" />
                  <span>{member.studentsCount} students</span>
                </div>
                {member.alertsHandled !== undefined && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>{member.alertsHandled} alerts handled</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="h-3 w-3" />
                  <span>Last active: {new Date(member.lastActive).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
        {staff.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-slate-600">No staff members found.</p>
          </Card>
        )}
      </section>
    </DashboardShell>
  );
}

