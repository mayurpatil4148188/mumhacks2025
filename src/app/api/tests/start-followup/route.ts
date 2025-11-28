import { NextResponse } from "next/server";
import { startTest } from "@/services/tests";
import { requireStudentSession, withErrorHandling } from "@/lib/api/route-helpers";

export const POST = withErrorHandling(async () => {
  const session = await requireStudentSession();
  const instance = await startTest({
    studentId: session.user.id,
    schoolId: session.user.schoolId,
    type: "FOLLOWUP",
  });
  return NextResponse.json({ testInstanceId: instance._id, questions: instance.questions });
});
