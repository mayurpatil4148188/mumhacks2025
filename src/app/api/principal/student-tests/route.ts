import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { withErrorHandling, requireRoleSession } from "@/lib/api/route-helpers";
import { dbConnect } from "@/db/connection";
import { StudentTestInstance, AIScoringResult } from "@/models/StudentTestInstance";
import { StudentProfile } from "@/models/StudentProfile";
import { User } from "@/models/User";
import { RAGDocument } from "@/models/RAGDocument";

export const GET = withErrorHandling(async (req: Request) => {
  const session = await requireRoleSession(["PRINCIPAL", "MASTER_ADMIN", "TEACHER"]);
  const url = new URL(req.url);
  const studentId = url.searchParams.get("studentId");
  const schoolId = session.user.schoolId;
  if (!studentId || !schoolId) {
    return NextResponse.json({ error: "Missing studentId or schoolId" }, { status: 400 });
  }

  await dbConnect();
  const studentObjectId = new mongoose.Types.ObjectId(studentId);

  const [profile, user, tests, personaDoc, studentFriendlyDoc] = await Promise.all([
    StudentProfile.findOne({ userId: studentObjectId, schoolId }).lean(),
    User.findById(studentObjectId).select("name email").lean(),
    StudentTestInstance.find({ studentId: studentObjectId, schoolId }).sort({ createdAt: -1 }).lean(),
    RAGDocument.findOne({ studentId, schoolId, type: "STUDENT_PERSONA" }).sort({ updatedAt: -1 }).lean(),
    RAGDocument.findOne({ studentId, schoolId, type: "STUDENT_PERSONA_STUDENT_FRIENDLY" })
      .sort({ updatedAt: -1 })
      .lean(),
  ]);

  const scoreMap = new Map<string, any>();
  if (tests.length) {
    const scores = await AIScoringResult.find({
      testInstanceId: { $in: tests.map((t) => t._id) },
    })
      .lean()
      .exec();
    scores.forEach((s) => scoreMap.set(s.testInstanceId.toString(), s));
  }

  const testSummaries = tests.map((t) => {
    const score = scoreMap.get(t._id.toString());
    const topDomains =
      score?.domainScores?.slice(0, 3).map((d: any) => `${d.domain}: risk ${d.riskLevel}`).join(" • ") || "";
    return {
      id: t._id.toString(),
      templateType: t.templateType,
      status: t.status,
      createdAt: t.createdAt,
      completedAt: t.completedAt,
      summary: score?.overallSummaryForTeacher || topDomains || "Summary not available.",
    };
  });

  return NextResponse.json({
    student: {
      id: studentId,
      name: user?.name || "Student",
      grade: profile?.grade || null,
      section: profile?.section || null,
      rollNumber: profile?.rollNumber || null,
    },
    persona: personaDoc?.text || null,
    personaStudentFriendly: studentFriendlyDoc?.text || null,
    tests: testSummaries,
  });
});
