import { NextResponse } from "next/server";
import { requireStudentSession, withErrorHandling } from "@/lib/api/route-helpers";
import { dbConnect } from "@/db/connection";
import { StudentTestInstance } from "@/models/StudentTestInstance";

export const GET = withErrorHandling(async () => {
  const session = await requireStudentSession();
  await dbConnect();

  const [latestBaseline, completedBaseline, baselineCompletedCount, followupCompletedCount] =
    await Promise.all([
      StudentTestInstance.findOne({
        studentId: session.user.id,
        schoolId: session.user.schoolId,
        templateType: "BASELINE",
      })
      .sort({ createdAt: -1 })
      .lean(),
    StudentTestInstance.exists({
      studentId: session.user.id,
      schoolId: session.user.schoolId,
      templateType: "BASELINE",
      status: "COMPLETED",
    }),
      StudentTestInstance.countDocuments({
        studentId: session.user.id,
        schoolId: session.user.schoolId,
        templateType: "BASELINE",
        status: "COMPLETED",
      }),
      StudentTestInstance.countDocuments({
        studentId: session.user.id,
        schoolId: session.user.schoolId,
        templateType: "FOLLOWUP",
        status: "COMPLETED",
      }),
    ]);

  const baselineCompleted = Boolean(completedBaseline);

  return NextResponse.json({
    baselineCompleted,
    latestBaselineId: latestBaseline?._id || null,
    status: latestBaseline?.status || null,
    completedAt: latestBaseline?.completedAt || null,
    counts: {
      baselineCompleted: baselineCompletedCount || 0,
      followupCompleted: followupCompletedCount || 0,
    },
  });
});
