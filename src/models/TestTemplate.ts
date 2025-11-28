import mongoose, { Schema, Model } from "mongoose";
import { BaseDocument, Question, TestTemplateType } from "@/types";

export interface TestTemplateDocument extends BaseDocument {
  type: TestTemplateType;
  name: string;
  description?: string;
  questions: Question[];
  createdBy: mongoose.Types.ObjectId;
  schoolId?: mongoose.Types.ObjectId | null;
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

const questionSchema = new Schema<Question>(
  {
    id: String,
    text: String,
    answerType: String,
    domainTags: [String],
    isPersonalized: { type: Boolean, default: false },
    weight: { type: Number, default: 1 },
    options: [answerOptionSchema],
  },
  { _id: false }
);

const templateSchema = new Schema<TestTemplateDocument>(
  {
    type: { type: String, enum: ["BASELINE", "FOLLOWUP"], required: true },
    name: { type: String, required: true },
    description: String,
    questions: [questionSchema],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    schoolId: { type: Schema.Types.ObjectId, ref: "School", default: null },
  },
  { timestamps: true }
);

export const TestTemplate: Model<TestTemplateDocument> =
  mongoose.models.TestTemplate ||
  mongoose.model<TestTemplateDocument>("TestTemplate", templateSchema);
