import { dbConnect } from "@/db/connection";
import { generateQuestions } from "@/ai/questions";
import { scoreTestResponses } from "@/ai/score";
import { StudentProfile } from "@/models/StudentProfile";
import { StudentTestInstance, AIScoringResult, AIScoringResultDocument } from "@/models/StudentTestInstance";
import { decideAlerts } from "@/services/alert-engine";
import { Alert } from "@/models/StudentTestInstance";
import { indexRAGDocument, upsertRAGDocument } from "@/rag";
import { User } from "@/models/User";
import { TestTemplate } from "@/models/TestTemplate";

const defaultLikertOptions5 = [
  { key: "a", text: "Never", score: 1 },
  { key: "b", text: "Rarely", score: 2 },
  { key: "c", text: "Sometimes", score: 3 },
  { key: "d", text: "Often", score: 4 },
  { key: "e", text: "Always", score: 5 },
];

const defaultLikertOptions4 = [
  { key: "a", text: "Not at all / Never", score: 0 },
  { key: "b", text: "A little / Rarely", score: 1 },
  { key: "c", text: "Some / Sometimes", score: 2 },
  { key: "d", text: "A lot / Often", score: 3 },
];

function resolveOptionsForQuestion(q: any) {
  if (q.options?.length) return q.options;
  if (q.answerType === "LIKERT_1_4") return defaultLikertOptions4;
  return defaultLikertOptions5;
}

export async function startTest({
  studentId,
  schoolId,
  type,
}: {
  studentId: string;
  schoolId: string;
  type: "BASELINE" | "FOLLOWUP";
}) {
  await dbConnect();
  const studentProfile = await StudentProfile.findOne({ userId: studentId, schoolId });
  if (!studentProfile) throw new Error("Student profile not found");

  let questions;
  if (type === "BASELINE") {
    // Prefer school-specific template, otherwise fall back to a global baseline template.
    const template =
      (await TestTemplate.findOne({ type: "BASELINE", schoolId })) ||
      (await TestTemplate.findOne({ type: "BASELINE", schoolId: null }));
    if (!template) throw new Error("Baseline template not configured");
    questions = template.questions;
  } else {
    const lastScore = await AIScoringResult.findOne({ studentId, schoolId }).sort({ createdAt: -1 });
    questions = await generateQuestions(type, studentProfile, lastScore);
  }

  const instance = await StudentTestInstance.create({
    studentId,
    schoolId,
    templateType: type,
    questions: questions.map((q) => ({
      questionId: q.id,
      text: q.text,
      domainTags: q.domainTags,
      answerValue: undefined,
      options: resolveOptionsForQuestion(q),
    })),
  });

  return instance;
}

function buildPersonaText({
  score,
  studentId,
  studentProfile,
  user,
  templateType,
}: {
  score: AIScoringResultDocument;
  studentId: string;
  studentProfile: any;
  user: any;
  templateType: "BASELINE" | "FOLLOWUP";
}) {
  const sorted = [...score.domainScores].sort((a, b) => b.riskLevel - a.riskLevel);
  const topThree = sorted.slice(0, 3);
  const concerns = topThree
    .map((d) => `${d.domain} (level ${d.riskLevel}/3) — ${d.explanation}`)
    .join(" • ");

  const overallRisk =
    sorted.find((d) => d.riskLevel >= 3) ? "high"
      : sorted.find((d) => d.riskLevel === 2) ? "elevated"
      : sorted.find((d) => d.riskLevel === 1) ? "mild"
      : "low";

  const name = user?.name || "Student";
  const grade = studentProfile?.grade ? `Grade ${studentProfile.grade}` : "Grade N/A";
  const section = studentProfile?.section ? `Section ${studentProfile.section}` : "Section N/A";
  const roll = studentProfile?.rollNumber ? `Roll ${studentProfile.rollNumber}` : "Roll N/A";

  const teacherNote = score.overallSummaryForTeacher || "Please review and add your own note.";

  return [
    `${name} (${grade}, ${section}, ${roll}) — Latest ${templateType.toLowerCase()} check-in.`,
    `Overall wellbeing risk looks ${overallRisk}.`,
    concerns ? `Main areas to watch: ${concerns}.` : "No specific risk areas stood out.",
    `Notes for staff: ${teacherNote}`,
  ].join("\n");
}

export async function submitTest({
  testInstanceId,
  answers,
  studentId,
}: {
  testInstanceId: string;
  answers: { questionId: string; answerValue: number }[];
  studentId: string;
}) {
  await dbConnect();
  const test = await StudentTestInstance.findById(testInstanceId);
  if (!test) throw new Error("Test not found");
  if (test.studentId.toString() !== studentId) throw new Error("You cannot submit this assessment.");
  test.questions = test.questions.map((q) => {
    const answer = answers.find((a) => a.questionId === String(q.questionId));
    return { ...q.toObject(), answerValue: answer?.answerValue ?? q.answerValue };
  });
  test.markModified("questions");

  const score = await scoreTestResponses(test);
  const { alertLevel, domainFlags } = decideAlerts(score.domainScores);
  if (alertLevel) {
    await Alert.create({
      studentId: test.studentId,
      schoolId: test.schoolId,
      testInstanceId: test._id,
      domainFlags,
      status: "OPEN",
    });
  }

  // Mark test as completed
  test.status = "COMPLETED";
  test.completedAt = new Date();

  // RAG indexing should not block submission; log and continue on failure.
  try {
    await upsertRAGDocument({
      filter: {
        schoolId: test.schoolId.toString(),
        studentId: test.studentId.toString(),
        type: "ASSESSMENT_SUMMARY",
      },
      doc: {
        sourceId: test._id.toString(),
        text: score.overallSummaryForTeacher || "Assessment summary",
      },
    });

    const studentProfile = await StudentProfile.findOne({ userId: test.studentId, schoolId: test.schoolId });
    const user = await User.findById(test.studentId);
    const personaText = buildPersonaText({
      score,
      studentId: test.studentId.toString(),
      studentProfile,
      user,
      templateType: test.templateType,
    });
    await upsertRAGDocument({
      filter: {
        schoolId: test.schoolId.toString(),
        studentId: test.studentId.toString(),
        type: "STUDENT_PERSONA",
      },
      doc: {
        sourceId: test._id.toString(),
        text: personaText,
      },
    });
  } catch (ragError) {
    console.warn("RAG indexing skipped:", (ragError as Error)?.message);
  }

  // Save the test with completed status
  await test.save();

  return { score, alertLevel, domainFlags };
}

export async function markFalseAlert(testInstanceId: string) {
  await dbConnect();
  const test = await StudentTestInstance.findById(testInstanceId);
  if (!test) throw new Error("Test not found");
  test.status = "INVALIDATED";
  test.invalidatedAt = new Date();
  await test.save();

  await AIScoringResult.updateOne({ testInstanceId }, { excludedFromRAG: true });
  await Alert.updateMany({ testInstanceId }, { status: "CLOSED" });
  return test;
}
