import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { startTest } from "@/services/tests";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { schoolId, studentId } = await req.json();
    const instance = await startTest({
      studentId: studentId || session.user.id,
      schoolId: schoolId || session.user.schoolId,
      type: "BASELINE",
    });
    return NextResponse.json({ testInstanceId: instance._id, questions: instance.questions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
