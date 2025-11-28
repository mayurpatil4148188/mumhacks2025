import { baselineQuestions } from "@/lib/data";
import { domainList } from "@/lib/validators";
import { Question, TestTemplateType } from "@/types";
import { StudentProfileDocument } from "@/models/StudentProfile";
import { AIScoringResultDocument } from "@/models/StudentTestInstance";

export async function generateQuestions(
  type: TestTemplateType,
  student: StudentProfileDocument,
  lastScores?: AIScoringResultDocument | null
): Promise<Question[]> {
  if (type === "BASELINE") {
    return baselineQuestions;
  }

  const elevatedDomains = lastScores?.domainScores
    ?.filter((d) => d.riskLevel >= 1)
    .map((d) => d.domain) || [domainList[0]];

  const followups: Question[] = elevatedDomains.slice(0, 3).map((domain, index) => ({
    id: `follow-${index}`,
    text: `Thinking about recent days, how strongly has ${domain.toLowerCase()} affected your routine?`,
    answerType: "LIKERT_1_5",
    domainTags: [domain],
    isPersonalized: true,
    weight: 1.2,
  }));

  const preferenceNote = student.preferences?.favourite_things?.nature as string | undefined;
  if (preferenceNote) {
    followups.push({
      id: "follow-preference",
      text: `You mentioned enjoying ${preferenceNote}. Have you had chances to enjoy that lately?`,
      answerType: "LIKERT_1_5",
      domainTags: [elevatedDomains[0]],
      isPersonalized: true,
      weight: 1,
    });
  }

  while (followups.length < 10) {
    followups.push({
      id: `follow-generic-${followups.length}`,
      text: "How are you feeling about your friendships this week?",
      answerType: "LIKERT_1_5",
      domainTags: ["Social isolation"],
      weight: 1,
    });
  }

  return followups.slice(0, 12);
}
