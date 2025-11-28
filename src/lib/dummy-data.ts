import mongoose from "mongoose";

const studentId = new mongoose.Types.ObjectId("000000000000000000000001");
const studentId2 = new mongoose.Types.ObjectId("000000000000000000000002");
const studentId3 = new mongoose.Types.ObjectId("000000000000000000000003");
const schoolId = new mongoose.Types.ObjectId("0000000000000000000000aa");

export const dummyUserPrincipal = {
  email: "principal@dummy.school",
  password: "welcome123",
  schoolId: schoolId.toString(),
};

export const dummyUserStudent = {
  email: "student@dummy.school",
  password: "welcome123",
  schoolId: schoolId.toString(),
};

export const dummyStudentProfile = {
  userId: studentId,
  schoolId,
  grade: "6",
  section: "A",
  rollNumber: "6A-01",
};

export const dummyStudents = [
  {
    id: studentId.toString(),
    name: "Aarav Patel",
    grade: "6",
    section: "A",
    rollNumber: "6A-01",
    baselineDone: true,
    followupCount: 2,
    alertCount: 2,
    personaSnippet: "Overall wellbeing risk looks elevated. Main areas to watch: Social isolation (level 2/3), Bullying (level 1/3), Self-harm risk (level 1/3).",
  },
  {
    id: studentId2.toString(),
    name: "Priya Sharma",
    grade: "6",
    section: "B",
    rollNumber: "6B-15",
    baselineDone: true,
    followupCount: 1,
    alertCount: 0,
    personaSnippet: "Student shows good social connections. Academic pressure is moderate. Continue monitoring.",
  },
  {
    id: studentId3.toString(),
    name: "Rohan Kumar",
    grade: "7",
    section: "A",
    rollNumber: "7A-08",
    baselineDone: false,
    followupCount: 0,
    alertCount: 1,
    personaSnippet: null,
  },
];

export const dummyPersona = {
  staff: [
    "Aarav Patel (Grade 6, Section A, Roll 6A-01) — Latest baseline check-in.",
    "Overall wellbeing risk looks elevated.",
    "Main areas to watch: Social isolation (level 2/3) — feeling left out at times • Bullying (level 1/3) — occasional mean comments • Self-harm risk (level 1/3) — mild worries reported.",
    "Notes for staff: Offer regular check-ins, pair with supportive peers, and keep communication open with family.",
  ].join("\n"),
  student: [
    "Aarav, we are noticing how you're doing in school.",
    "We want to check in about: feeling left out, occasional mean comments, and some worries.",
    "Your feelings matter. If anything feels hard, you can talk to your teacher or counselor.",
  ].join(" "),
};

export const dummyBaselineQuestions = [
  {
    questionId: "base-1",
    id: "base-1",
    text: "When other children say mean things to you at school, what usually happens?",
    answerType: "LIKERT_1_4",
    domainTags: ["Bullying"],
    options: [
      { key: "a", text: "Not at all / Never", score: 0 },
      { key: "b", text: "A little / Rarely", score: 1 },
      { key: "c", text: "Some / Sometimes", score: 2 },
      { key: "d", text: "A lot / Often", score: 3 },
    ],
  },
  {
    questionId: "base-2",
    id: "base-2",
    text: "Have you ever been pushed, hit, or kicked by other children?",
    answerType: "LIKERT_1_4",
    domainTags: ["Bullying"],
    options: [
      { key: "a", text: "Not at all / Never", score: 0 },
      { key: "b", text: "A little / Rarely", score: 1 },
      { key: "c", text: "Some / Sometimes", score: 2 },
      { key: "d", text: "A lot / Often", score: 3 },
    ],
  },
  {
    questionId: "base-3",
    id: "base-3",
    text: "How often do you feel worried or scared about things?",
    answerType: "LIKERT_1_4",
    domainTags: ["Self-harm risk"],
    options: [
      { key: "a", text: "Not at all / Never", score: 0 },
      { key: "b", text: "A little / Rarely", score: 1 },
      { key: "c", text: "Some / Sometimes", score: 2 },
      { key: "d", text: "A lot / Often", score: 3 },
    ],
  },
  {
    questionId: "base-4",
    id: "base-4",
    text: "Do you have friends you can talk to when you feel sad?",
    answerType: "LIKERT_1_4",
    domainTags: ["Social isolation"],
    options: [
      { key: "a", text: "Not at all / Never", score: 0 },
      { key: "b", text: "A little / Rarely", score: 1 },
      { key: "c", text: "Some / Sometimes", score: 2 },
      { key: "d", text: "A lot / Often", score: 3 },
    ],
  },
  {
    questionId: "base-5",
    id: "base-5",
    text: "How do you feel about your school work?",
    answerType: "LIKERT_1_4",
    domainTags: ["Academic pressure"],
    options: [
      { key: "a", text: "Not at all / Never", score: 0 },
      { key: "b", text: "A little / Rarely", score: 1 },
      { key: "c", text: "Some / Sometimes", score: 2 },
      { key: "d", text: "A lot / Often", score: 3 },
    ],
  },
];

export const dummyFollowupQuestions = [
  {
    questionId: "follow-1",
    id: "follow-1",
    text: "Thinking about recent days, how strongly has bullying affected your routine?",
    answerType: "LIKERT_1_5",
    domainTags: ["Bullying"],
    options: [
      { key: "a", text: "Never", score: 1 },
      { key: "b", text: "Rarely", score: 2 },
      { key: "c", text: "Sometimes", score: 3 },
      { key: "d", text: "Often", score: 4 },
      { key: "e", text: "Always", score: 5 },
    ],
  },
  {
    questionId: "follow-2",
    id: "follow-2",
    text: "How are you feeling about your friendships this week?",
    answerType: "LIKERT_1_5",
    domainTags: ["Social isolation"],
    options: [
      { key: "a", text: "Never", score: 1 },
      { key: "b", text: "Rarely", score: 2 },
      { key: "c", text: "Sometimes", score: 3 },
      { key: "d", text: "Often", score: 4 },
      { key: "e", text: "Always", score: 5 },
    ],
  },
  {
    questionId: "follow-3",
    id: "follow-3",
    text: "Have you been feeling worried or anxious lately?",
    answerType: "LIKERT_1_5",
    domainTags: ["Self-harm risk"],
    options: [
      { key: "a", text: "Never", score: 1 },
      { key: "b", text: "Rarely", score: 2 },
      { key: "c", text: "Sometimes", score: 3 },
      { key: "d", text: "Often", score: 4 },
      { key: "e", text: "Always", score: 5 },
    ],
  },
];

export const dummyTests = [
  {
    _id: new mongoose.Types.ObjectId("100000000000000000000001"),
    studentId,
    schoolId,
    templateType: "BASELINE",
    status: "COMPLETED",
    createdAt: new Date("2024-11-29"),
    completedAt: new Date("2024-11-29"),
    summary:
      "Overall wellbeing risk looks elevated. Main areas: Social isolation (level 2/3), Bullying (level 1/3), Self-harm risk (level 1/3).",
  },
  {
    _id: new mongoose.Types.ObjectId("100000000000000000000002"),
    studentId,
    schoolId,
    templateType: "FOLLOWUP",
    status: "COMPLETED",
    createdAt: new Date("2024-12-15"),
    completedAt: new Date("2024-12-15"),
    summary:
      "Student reports feeling a bit more connected this week. Bullying risk stays mild. Continue gentle check-ins and peer support.",
  },
];

export const dummyAlerts = [
  {
    _id: new mongoose.Types.ObjectId("200000000000000000000001"),
    studentId,
    schoolId,
    status: "OPEN",
    createdAt: new Date("2024-12-01"),
    domainFlags: [{ domain: "Bullying", alertLevel: "YELLOW", riskLevel: 1 }],
  },
  {
    _id: new mongoose.Types.ObjectId("200000000000000000000002"),
    studentId,
    schoolId,
    status: "OPEN",
    createdAt: new Date("2024-12-05"),
    domainFlags: [{ domain: "Social isolation", alertLevel: "YELLOW", riskLevel: 2 }],
  },
  {
    _id: new mongoose.Types.ObjectId("200000000000000000000003"),
    studentId: studentId3,
    schoolId,
    status: "OPEN",
    createdAt: new Date("2024-12-10"),
    domainFlags: [{ domain: "Academic pressure", alertLevel: "RED", riskLevel: 3 }],
  },
];

export const dummyStudent = {
  id: studentId.toString(),
  name: "Aarav Patel",
  grade: dummyStudentProfile.grade,
  section: dummyStudentProfile.section,
  rollNumber: dummyStudentProfile.rollNumber,
};

export const dummyStudentTests = dummyTests.map((t) => ({
  id: t._id.toString(),
  templateType: t.templateType,
  status: t.status,
  createdAt: t.createdAt,
  completedAt: t.completedAt,
  summary: t.summary,
}));

export const dummyLatestScore = {
  _id: new mongoose.Types.ObjectId("400000000000000000000001"),
  studentId,
  schoolId,
  createdAt: new Date("2024-12-15"),
  domainScores: [
    { domain: "Social isolation", riskLevel: 2 },
    { domain: "Bullying", riskLevel: 1 },
    { domain: "Self-harm risk", riskLevel: 1 },
  ],
  overallSummaryForTeacher:
    "Overall wellbeing risk looks elevated. Main areas: Social isolation (level 2/3), Bullying (level 1/3), Self-harm risk (level 1/3).",
};

export const dummyChatResponses: Record<string, string> = {
  default: "Based on the student's persona, I recommend offering regular check-ins and pairing them with supportive peers. Keep communication open with the family.",
  "how is the student doing": "The student shows elevated wellbeing risk in social isolation (level 2/3), bullying (level 1/3), and self-harm risk (level 1/3). Regular check-ins would be beneficial.",
  "what should i do": "I suggest: 1) Offer regular check-ins, 2) Pair with supportive peers, 3) Keep communication open with family. These steps can help address the identified concerns.",
  "tell me about alerts": "The student has 2 open alerts: Bullying (YELLOW, risk level 1) and Social isolation (YELLOW, risk level 2). Both require gentle monitoring and support.",
};

export function getDummyChatResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  for (const [key, response] of Object.entries(dummyChatResponses)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }
  return dummyChatResponses.default;
}
