import { NextResponse } from "next/server";
import { startTest } from "@/services/tests";
import { requireStudentSession, withErrorHandling } from "@/lib/api/route-helpers";
import { isDummyMode } from "@/lib/env";
import { dummyFollowupQuestions } from "@/lib/dummy-data";
import mongoose from "mongoose";

export const POST = withErrorHandling(async () => {
  const session = await requireStudentSession();

  if (isDummyMode()) {
    // Return dummy test instance for followup
    const dummyTestId = new mongoose.Types.ObjectId("300000000000000000000002");
    return NextResponse.json({
      testInstanceId: dummyTestId.toString(),
      questions: dummyFollowupQuestions,
    });
  }

  const instance = await startTest({
    studentId: session.user.id,
    schoolId: session.user.schoolId,
    type: "FOLLOWUP",
  });
  return NextResponse.json({ testInstanceId: instance._id, questions: instance.questions });
});
