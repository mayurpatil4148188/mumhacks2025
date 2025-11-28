import { AIChatSession } from "@/models/AIChatSession";
import { openai } from "@/ai/openaiClient";

export async function teacherAlertChat(params: {
  teacherId: string;
  studentId: string;
  schoolId: string;
  message: string;
  relatedTestInstanceId?: string;
}) {
  const systemPrompt =
    "You are a school well-being assistant. Help teachers understand alerts and suggest kind, practical ways to support the student. Do not diagnose or label with mental disorders.";

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: params.message },
    ],
    temperature: 0.4,
  });

  const reply = completion.choices[0]?.message?.content || "Thanks for sharing. Encourage a calm check-in with the student.";

  await AIChatSession.findOneAndUpdate(
    {
      teacherId: params.teacherId,
      studentId: params.studentId,
      schoolId: params.schoolId,
      relatedTestInstanceId: params.relatedTestInstanceId,
    },
    {
      $push: {
        messages: [
          { role: "user", content: params.message },
          { role: "assistant", content: reply },
        ],
      },
    },
    { upsert: true, new: true }
  );

  return reply;
}
