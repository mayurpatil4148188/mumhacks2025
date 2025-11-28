import { NextResponse } from "next/server";
import { chatMessageSchema } from "@/lib/validators";
import { getAuthSession } from "@/lib/auth";
import { teacherAlertChat } from "@/ai/chat";
import { isDummyMode } from "@/lib/env";
import { getDummyChatResponse } from "@/lib/dummy-data";

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = chatMessageSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  if (isDummyMode()) {
    const reply = getDummyChatResponse(parsed.data.message || "");
    return NextResponse.json({ reply });
  }

  const reply = await teacherAlertChat(parsed.data);
  return NextResponse.json({ reply });
}
