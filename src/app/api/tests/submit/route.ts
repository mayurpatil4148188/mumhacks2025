import { NextResponse } from "next/server";
import { submitTest } from "@/services/tests";
import { getAuthSession } from "@/lib/auth";
import { submitTestSchema } from "@/lib/validators";

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const json = await req.json();
  const parsed = submitTestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
  }
  try {
    const { score, alertLevel, domainFlags } = await submitTest(parsed.data);
    return NextResponse.json({ score, alertLevel, domainFlags });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
