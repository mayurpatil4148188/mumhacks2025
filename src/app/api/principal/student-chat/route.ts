import { NextResponse } from "next/server";
import { withErrorHandling, requireRoleSession } from "@/lib/api/route-helpers";
import { openai } from "@/ai/openaiClient";

export const POST = withErrorHandling(async (req: Request) => {
  const session = await requireRoleSession(["PRINCIPAL", "MASTER_ADMIN", "TEACHER"]);
  const json = await req.json();
  const { studentId, message, persona } = json || {};

  if (!studentId || !message) {
    return NextResponse.json({ error: "Missing studentId or message" }, { status: 400 });
  }

  const systemPrompt = [
    "You are a supportive well-being assistant for school leaders.",
    "Use ONLY the student persona context to respond in clear, kind language.",
    "Keep replies concise, practical, and focused on student wellbeing for principals, teachers, or counselors.",
    "Avoid medical diagnoses or therapy instructions. Offer supportive next steps in plain language.",
    "If the question is vague, gently suggest a caring way to check in with the student using the persona context.",
    "If the question is not about this student, reply kindly: 'I can only discuss this student’s wellbeing.'",
  ].join(" ");

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.4,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "system", content: `Student persona:\n${persona || "No persona provided"}` },
      { role: "user", content: message },
    ],
  });

  const reply =
    completion.choices[0]?.message?.content ||
    "Here’s a gentle approach: check in with the student, acknowledge their feelings, and offer support.";

  return NextResponse.json({ reply });
});
