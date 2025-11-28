import { dbConnect } from "@/db/connection";
import { generateQuestions } from "@/ai/questions";
import { scoreTestResponses } from "@/ai/score";
import { StudentProfile } from "@/models/StudentProfile";
import { StudentTestInstance, AIScoringResult } from "@/models/StudentTestInstance";
import { decideAlerts } from "@/services/alert-engine";
import { Alert } from "@/models/StudentTestInstance";
import { indexRAGDocument } from "@/rag";
import { User } from "@/models/User";
import { TestTemplate } from "@/models/TestTemplate";

const defaultLikertOptions = [
  { label: "Never", value: 1 },
  { label: "Rarely", value: 2 },
  { label: "Sometimes", value: 3 },
  { label: "Often", value: 4 },
  { label: "Always", value: 5 },
];

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
      options: q.options?.length ? q.options : defaultLikertOptions,
    })),
  });

  return instance;
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

  await indexRAGDocument({
    schoolId: test.schoolId.toString(),
    studentId: test.studentId.toString(),
    type: "ASSESSMENT_SUMMARY",
    sourceId: test._id.toString(),
    text: score.overallSummaryForTeacher || "Assessment summary",
  });

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
