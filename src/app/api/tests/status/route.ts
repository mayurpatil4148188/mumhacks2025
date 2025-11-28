import { NextResponse } from "next/server";
import { requireStudentSession, withErrorHandling } from "@/lib/api/route-helpers";
import { dbConnect } from "@/db/connection";
import { StudentTestInstance } from "@/models/StudentTestInstance";
import { isDummyMode } from "@/lib/env";
import { dummyStudentTests } from "@/lib/dummy-data";

export const GET = withErrorHandling(async () => {
  const session = await requireStudentSession();
  if (isDummyMode()) {
    const baselineCompleted = dummyStudentTests.some(
      (t) => t.templateType === "BASELINE" && t.status === "COMPLETED"
    );
    const latestBaseline = dummyStudentTests.find((t) => t.templateType === "BASELINE");
    return NextResponse.json({
      baselineCompleted,
      latestBaselineId: latestBaseline?.id || null,
      status: latestBaseline?.status || null,
      completedAt: latestBaseline?.completedAt || null,
      counts: {
        baselineCompleted: baselineCompleted ? 1 : 0,
        followupCompleted: dummyStudentTests.filter((t) => t.templateType === "FOLLOWUP").length,
      },
    });
  }

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
