import { Document, Types } from "mongoose";

export type Role =
  | "MASTER_ADMIN"
  | "PRINCIPAL"
  | "TEACHER"
  | "PARENT"
  | "STUDENT";

export type TestTemplateType = "BASELINE" | "FOLLOWUP";
export type TestStatus = "IN_PROGRESS" | "COMPLETED" | "INVALIDATED";
export type AlertLevel = "YELLOW" | "RED";
export type AlertStatus = "OPEN" | "ACKNOWLEDGED" | "CLOSED";

export type Domain =
  | "Bullying"
  | "Self-harm risk"
  | "Family stress"
  | "Academic pressure"
  | "Social isolation"
  | "Trauma"
  | "Neglect"
  | "Eating disorders";

export interface BaseDocument extends Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  id: string;
  text: string;
  answerType: "LIKERT_1_5" | "LIKERT_1_4" | "MCQ";
  domainTags: Domain[];
  isPersonalized?: boolean;
  weight?: number;
  options?: AnswerOption[];
}

export interface DomainScore {
  domain: Domain;
  riskLevel: 0 | 1 | 2 | 3;
  explanation: string;
}

export interface StudentTestQuestion {
  questionId: string;
  text: string;
  domainTags: Domain[];
  answerValue?: number;
  options?: AnswerOption[];
}

export interface AnswerOption {
  key: string;
  text: string;
  riskLevel?: "None" | "Low" | "Mid" | "High";
  score: number;
}
