import { Question } from "@/types";

export const baselineQuestions: Question[] = [
  {
    id: "q1",
    text: "How supported do you feel by classmates during group activities?",
    answerType: "LIKERT_1_5",
    domainTags: ["Bullying", "Social isolation"],
    weight: 1,
  },
  {
    id: "q2",
    text: "Over the past week, how often have you felt overwhelmed by schoolwork?",
    answerType: "LIKERT_1_5",
    domainTags: ["Academic pressure"],
    weight: 1,
  },
  {
    id: "q3",
    text: "Do you have someone you can talk to when something difficult happens?",
    answerType: "LIKERT_1_5",
    domainTags: ["Social isolation", "Trauma"],
    weight: 1,
  },
  {
    id: "q4",
    text: "How safe do you feel on your way to and from school?",
    answerType: "LIKERT_1_5",
    domainTags: ["Bullying", "Neglect"],
    weight: 1,
  },
  {
    id: "q5",
    text: "How often do family responsibilities affect your ability to study or rest?",
    answerType: "LIKERT_1_5",
    domainTags: ["Family stress", "Neglect"],
    weight: 1,
  },
];

export const demoStudents = [
  { id: "stu-1", name: "Aarav Shah", grade: "8", section: "A" },
  { id: "stu-2", name: "Diya Menon", grade: "9", section: "B" },
];
