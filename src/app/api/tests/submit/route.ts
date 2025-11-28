import { NextResponse } from "next/server";
import { submitTest } from "@/services/tests";
import { submitTestSchema } from "@/lib/validators";
import { requireStudentSession, withErrorHandling } from "@/lib/api/route-helpers";

export const POST = withErrorHandling(async (req: Request) => {
  const session = await requireStudentSession();
  const json = await req.json();
  const parsed = submitTestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
  }

  const { score, alertLevel, domainFlags } = await submitTest({
    ...parsed.data,
    studentId: session.user.id,
  });
  return NextResponse.json({ score, alertLevel, domainFlags });
});
