import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAuthSession } from "@/lib/auth";
import { dbConnect } from "@/db/connection";
import { principalNav } from "../nav";
import { StudentProfile } from "@/models/StudentProfile";
import { User } from "@/models/User";
import { Alert, StudentTestInstance } from "@/models/StudentTestInstance";
import { RAGDocument } from "@/models/RAGDocument";

type StudentRow = {
  id: string;
  name: string;
  grade?: string;
  section?: string;
  baselineDone: boolean;
  followupCount: number;
  alertCount: number;
  personaSnippet?: string;
};

export default async function PrincipalStudentsPage() {
  const session = await getAuthSession();
  if (!session || !session.user.schoolId) {
    throw new Error("Unauthorized or school not found.");
  }
  await dbConnect();

  const schoolId = session.user.schoolId;
  const profiles = await StudentProfile.find({ schoolId }).lean();
  const userIds = profiles.map((p) => p.userId);
  const users = await User.find({ _id: { $in: userIds } }).select("_id name").lean();
  const userNameMap = new Map(users.map((u) => [u._id.toString(), u.name || "Student"]));

  const [baselineTests, followupCounts, alerts, personas] = await Promise.all([
    StudentTestInstance.aggregate([
      { $match: { schoolId, templateType: "BASELINE" } },
      { $group: { _id: "$studentId", completed: { $max: { $eq: ["$status", "COMPLETED"] } } } },
    ]),
    StudentTestInstance.aggregate([
      { $match: { schoolId, templateType: "FOLLOWUP", status: "COMPLETED" } },
      { $group: { _id: "$studentId", count: { $sum: 1 } } },
    ]),
    Alert.aggregate([
      { $match: { schoolId, status: "OPEN" } },
      { $group: { _id: "$studentId", count: { $sum: 1 } } },
    ]),
    RAGDocument.find({ schoolId, type: "STUDENT_PERSONA", studentId: { $in: userIds } })
      .select("studentId text")
      .lean(),
  ]);

  const baselineMap = new Map(baselineTests.map((b: any) => [b._id.toString(), Boolean(b.completed)]));
  const followupMap = new Map(followupCounts.map((f: any) => [f._id.toString(), f.count || 0]));
  const alertMap = new Map(alerts.map((a: any) => [a._id.toString(), a.count || 0]));
  const personaMap = new Map(
    personas.map((p: any) => [p.studentId.toString(), (p.text as string)?.slice(0, 160) || ""])
  );

  const rows: StudentRow[] = profiles.map((p) => {
    const id = p.userId.toString();
    return {
      id,
      name: userNameMap.get(id) || "Student",
      grade: p.grade,
      section: p.section,
      baselineDone: baselineMap.get(id) || false,
      followupCount: followupMap.get(id) || 0,
      alertCount: alertMap.get(id) || 0,
      personaSnippet: personaMap.get(id),
    };
  });

  return (
    <DashboardShell
      title="Students"
      description="Review students, alerts, and quick personas."
      nav={principalNav}
    >
      <Card className="overflow-hidden border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Grade/Section</th>
                <th className="px-4 py-3">Baseline</th>
                <th className="px-4 py-3">Follow-ups</th>
                <th className="px-4 py-3">Open alerts</th>
                <th className="px-4 py-3">Persona</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td className="px-4 py-4 text-slate-600" colSpan={7}>
                    No students found for this school.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-semibold text-slate-900">{row.name}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {row.grade || "—"} {row.section ? `• ${row.section}` : ""}
                    </td>
                    <td className="px-4 py-3">
                      {row.baselineDone ? (
                        <Badge variant="success">Done</Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{row.followupCount}</td>
                    <td className="px-4 py-3">
                      {row.alertCount > 0 ? (
                        <Badge variant={row.alertCount > 1 ? "danger" : "warning"}>{row.alertCount}</Badge>
                      ) : (
                        <span className="text-slate-500">0</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {row.personaSnippet ? `${row.personaSnippet}…` : "No summary yet"}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/principal/students/${row.id}`}
                        className="text-emerald-700 underline-offset-2 hover:underline"
                      >
                        Explore
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardShell>
  );
}
