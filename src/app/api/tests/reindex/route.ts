import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { withErrorHandling, requireRoleSession } from "@/lib/api/route-helpers";
import { dbConnect } from "@/db/connection";
import { StudentTestInstance, AIScoringResult } from "@/models/StudentTestInstance";
import { StudentProfile } from "@/models/StudentProfile";
import { User } from "@/models/User";
import { upsertRAGDocument } from "@/rag";
import { scoreTestResponses } from "@/ai/score";
import { decideAlerts } from "@/services/alert-engine";
import { buildPersonaText } from "@/services/tests";

export const POST = withErrorHandling(async (req: Request) => {
  const session = await requireRoleSession(["PRINCIPAL", "MASTER_ADMIN"]);
  const url = new URL(req.url);
  const studentId = url.searchParams.get("studentId");
  const schoolId = session.user.schoolId;

  if (!studentId || !schoolId) {
    return NextResponse.json({ error: "Missing studentId or schoolId" }, { status: 400 });
  }

  await dbConnect();

  const studentObjectId = new mongoose.Types.ObjectId(studentId);
  const tests = await StudentTestInstance.find({ studentId: studentObjectId, schoolId }).sort({ createdAt: 1 });
  const profile = await StudentProfile.findOne({ userId: studentObjectId, schoolId });
  const user = await User.findById(studentObjectId);

  let reindexed = 0;

  for (const test of tests) {
    // Re-score to ensure consistency.
    const score = await scoreTestResponses(test);
    const { alertLevel, domainFlags } = decideAlerts(score.domainScores);
    if (alertLevel) {
      // Do not recreate alerts here to avoid duplicates.
    }

    await upsertRAGDocument({
      filter: {
        schoolId: test.schoolId.toString(),
        studentId: test.studentId.toString(),
        type: "ASSESSMENT_SUMMARY",
      },
      doc: {
        sourceId: test._id.toString(),
        text: score.overallSummaryForTeacher || "Assessment summary",
      },
    });

    const persona = buildPersonaText({
      score,
      studentId: test.studentId.toString(),
      studentProfile: profile,
      user,
      templateType: test.templateType,
    });

    await upsertRAGDocument({
      filter: {
        schoolId: test.schoolId.toString(),
        studentId: test.studentId.toString(),
        type: "STUDENT_PERSONA",
      },
      doc: {
        sourceId: test._id.toString(),
        text: persona.staffSummary,
      },
    });
    await upsertRAGDocument({
      filter: {
        schoolId: test.schoolId.toString(),
        studentId: test.studentId.toString(),
        type: "STUDENT_PERSONA_STUDENT_FRIENDLY",
      },
      doc: {
        sourceId: test._id.toString(),
        text: persona.studentFriendlySummary,
      },
    });

    reindexed += 1;
  }

  return NextResponse.json({ reindexed });
});
