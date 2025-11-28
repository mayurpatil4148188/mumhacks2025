import { NextResponse } from "next/server";
import { startTest } from "@/services/tests";
import { requireStudentSession, withErrorHandling } from "@/lib/api/route-helpers";
import { dbConnect } from "@/db/connection";
import { StudentTestInstance } from "@/models/StudentTestInstance";

export const POST = withErrorHandling(async () => {
  const session = await requireStudentSession();
  await dbConnect();

  // Check if student has already completed a baseline assessment
  const completedBaseline = await StudentTestInstance.exists({
    studentId: session.user.id,
    schoolId: session.user.schoolId,
    templateType: "BASELINE",
    status: "COMPLETED",
  });

  if (completedBaseline) {
    return NextResponse.json(
      { error: "You have already completed your baseline assessment. You cannot start a new one." },
      { status: 400 }
    );
  }

  const instance = await startTest({
    studentId: session.user.id,
    schoolId: session.user.schoolId,
    type: "BASELINE",
  });
  return NextResponse.json({ testInstanceId: instance._id, questions: instance.questions });
});
