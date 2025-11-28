import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAuthSession } from "@/lib/auth";
import { dbConnect } from "@/db/connection";
import { principalNav } from "../../nav";
import { StudentProfile } from "@/models/StudentProfile";
import { User } from "@/models/User";
import { Alert, AIScoringResult } from "@/models/StudentTestInstance";
import { RAGDocument } from "@/models/RAGDocument";
import mongoose from "mongoose";
import { PersonaChatBox } from "@/components/chat/persona-chat-box";

export default async function StudentDetailPage({ params }: { params: { id: string } }) {
  const session = await getAuthSession();
  if (!session || !session.user.schoolId) {
    throw new Error("Unauthorized or school not found.");
  }
  await dbConnect();

  const studentId = new mongoose.Types.ObjectId(params.id);
  const profile = await StudentProfile.findOne({ userId: studentId, schoolId: session.user.schoolId }).lean();
  if (!profile) {
    throw new Error("Student not found for this school.");
  }
  const user = await User.findById(studentId).select("name email").lean();
  const [openAlerts, latestScore, personaDoc] = await Promise.all([
    Alert.find({ studentId, schoolId: session.user.schoolId, status: "OPEN" }).lean(),
    AIScoringResult.findOne({ studentId, schoolId: session.user.schoolId }).sort({ createdAt: -1 }).lean(),
    RAGDocument.findOne({ studentId, schoolId: session.user.schoolId, type: "STUDENT_PERSONA" })
      .sort({ updatedAt: -1 })
      .lean(),
  ]);

  const personaText = personaDoc?.text || "No persona summary yet.";

  return (
    <DashboardShell
      title={user?.name || "Student"}
      description="Student overview, alerts, and persona summary."
      nav={principalNav}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <p className="text-sm text-slate-500">Grade / Section</p>
          <p className="text-xl font-semibold text-slate-900">
            {profile.grade || "—"} {profile.section ? `• ${profile.section}` : ""}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-500">Open alerts</p>
          <p className="text-3xl font-bold">{openAlerts.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-slate-500">Last risk update</p>
          <p className="text-xl font-semibold text-slate-900">
            {latestScore ? new Date(latestScore.createdAt).toLocaleDateString() : "N/A"}
          </p>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-2 p-4">
          <h3 className="text-lg font-semibold text-slate-900">Persona summary</h3>
          <p className="text-sm text-slate-700 whitespace-pre-line">{personaText}</p>
        </Card>

        <Card className="space-y-3 p-4">
          <h3 className="text-lg font-semibold text-slate-900">Open alerts</h3>
          {openAlerts.length === 0 ? (
            <p className="text-sm text-slate-600">No open alerts.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {openAlerts.map((alert: any) => (
                <li
                  key={alert._id.toString()}
                  className="rounded-md border border-slate-200 bg-white px-3 py-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">
                      {alert.domainFlags?.[0]?.domain || "Domain"}
                    </span>
                    <Badge variant={alert.domainFlags?.[0]?.alertLevel === "RED" ? "danger" : "warning"}>
                      {alert.domainFlags?.[0]?.alertLevel || alert.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600">
                    Risk level: {alert.domainFlags?.[0]?.riskLevel ?? "N/A"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
      <PersonaChatBox
        studentId={studentId.toString()}
        studentName={user?.name || "Student"}
        persona={personaText}
      />
    </DashboardShell>
  );
}
