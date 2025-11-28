import { StudentTestInstanceDocument, AIScoringResult } from "@/models/StudentTestInstance";
import { Domain, DomainScore } from "@/types";

function mapLikertToRisk(value: number): 0 | 1 | 2 | 3 {
  if (value >= 3) return 3;
  if (value >= 2) return 2;
  if (value >= 1) return 1;
  return 0;
}

export async function scoreTestResponses(test: StudentTestInstanceDocument) {
  const scoreMap: Record<string, { sum: number; count: number }> = {};
  test.questions.forEach((q) => {
    const key = q.domainTags[0];
    if (!scoreMap[key]) scoreMap[key] = { sum: 0, count: 0 };
    scoreMap[key].sum += q.answerValue || 0;
    scoreMap[key].count += 1;
  });

  const domainScores: DomainScore[] = Object.entries(scoreMap).map(([domain, val]) => {
    const avg = val.count ? val.sum / val.count : 0;
    const riskLevel = mapLikertToRisk(avg) as 0 | 1 | 2 | 3;
    return {
      domain: domain as Domain,
      riskLevel,
      explanation: `Average response ${avg.toFixed(2)} mapped to risk ${riskLevel}.`,
    };
  });

  const result = await AIScoringResult.create({
    testInstanceId: test._id,
    studentId: test.studentId,
    schoolId: test.schoolId,
    domainScores,
    overallSummaryForTeacher:
      "Automated risk estimate. Review and adjust. TODO: Replace with LLM summary.",
    overallSummaryForPrincipal: "High-level trends ready for leadership view.",
    overallSummaryForParent:
      "Thanks for the student check-in. We are monitoring general well-being.",
    rawLLMOutput: {},
  });

  test.aiScoringResultId = result._id;
  test.status = "COMPLETED";
  test.completedAt = new Date();
  await test.save();

  return result;
}
