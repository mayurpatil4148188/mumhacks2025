import mongoose, { Schema, Model } from "mongoose";
import { BaseDocument, DomainScore, StudentTestQuestion, TestTemplateType } from "@/types";

export interface StudentTestInstanceDocument extends BaseDocument {
  studentId: mongoose.Types.ObjectId;
  schoolId: mongoose.Types.ObjectId;
  templateType: TestTemplateType;
  questions: StudentTestQuestion[];
  status: "IN_PROGRESS" | "COMPLETED" | "INVALIDATED";
  aiScoringResultId?: mongoose.Types.ObjectId;
  createdAt: Date;
  completedAt?: Date;
  invalidatedAt?: Date;
}

const answerOptionSchema = new Schema(
  {
    key: String,
    text: String,
    riskLevel: String,
    score: Number,
  },
  { _id: false }
);

const testQuestionSchema = new Schema<StudentTestQuestion>(
  {
    questionId: String,
    text: String,
    domainTags: [String],
    answerValue: Number,
    options: [answerOptionSchema],
  },
  { _id: false }
);

const testInstanceSchema = new Schema<StudentTestInstanceDocument>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true },
    templateType: { type: String, enum: ["BASELINE", "FOLLOWUP"], required: true },
    questions: [testQuestionSchema],
    status: {
      type: String,
      enum: ["IN_PROGRESS", "COMPLETED", "INVALIDATED"],
      default: "IN_PROGRESS",
    },
    aiScoringResultId: { type: Schema.Types.ObjectId, ref: "AIScoringResult" },
    completedAt: Date,
    invalidatedAt: Date,
  },
  { timestamps: true }
);

export const StudentTestInstance: Model<StudentTestInstanceDocument> =
  mongoose.models.StudentTestInstance ||
  mongoose.model<StudentTestInstanceDocument>("StudentTestInstance", testInstanceSchema);

export interface AIScoringResultDocument extends BaseDocument {
  testInstanceId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  schoolId: mongoose.Types.ObjectId;
  domainScores: DomainScore[];
  overallSummaryForTeacher?: string;
  overallSummaryForPrincipal?: string;
  overallSummaryForParent?: string;
  rawLLMOutput?: Record<string, any>;
  excludedFromRAG?: boolean;
}

const domainScoreSchema = new Schema<DomainScore>(
  {
    domain: String,
    riskLevel: Number,
    explanation: String,
  },
  { _id: false }
);

const aiScoringSchema = new Schema<AIScoringResultDocument>(
  {
    testInstanceId: { type: Schema.Types.ObjectId, ref: "StudentTestInstance", required: true },
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true },
    domainScores: [domainScoreSchema],
    overallSummaryForTeacher: String,
    overallSummaryForPrincipal: String,
    overallSummaryForParent: String,
    rawLLMOutput: Schema.Types.Mixed,
    excludedFromRAG: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const AIScoringResult: Model<AIScoringResultDocument> =
  mongoose.models.AIScoringResult ||
  mongoose.model<AIScoringResultDocument>("AIScoringResult", aiScoringSchema);

export interface AlertFlag {
  domain: string;
  riskLevel: number;
  alertLevel: "YELLOW" | "RED";
}

export interface AlertDocument extends BaseDocument {
  studentId: mongoose.Types.ObjectId;
  schoolId: mongoose.Types.ObjectId;
  testInstanceId: mongoose.Types.ObjectId;
  domainFlags: AlertFlag[];
  status: "OPEN" | "ACKNOWLEDGED" | "CLOSED";
  acknowledgedBy?: mongoose.Types.ObjectId;
}

const alertFlagSchema = new Schema<AlertFlag>(
  {
    domain: String,
    riskLevel: Number,
    alertLevel: String,
  },
  { _id: false }
);

const alertSchema = new Schema<AlertDocument>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true },
    testInstanceId: { type: Schema.Types.ObjectId, ref: "StudentTestInstance", required: true },
    domainFlags: [alertFlagSchema],
    status: { type: String, enum: ["OPEN", "ACKNOWLEDGED", "CLOSED"], default: "OPEN" },
    acknowledgedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Alert: Model<AlertDocument> =
  mongoose.models.Alert || mongoose.model<AlertDocument>("Alert", alertSchema);
