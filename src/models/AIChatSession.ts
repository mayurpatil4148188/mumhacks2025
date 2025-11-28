import mongoose, { Schema, Model } from "mongoose";
import { BaseDocument } from "@/types";

export interface AIChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  createdAt?: Date;
}

export interface AIChatSessionDocument extends BaseDocument {
  teacherId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  schoolId: mongoose.Types.ObjectId;
  relatedTestInstanceId?: mongoose.Types.ObjectId;
  messages: AIChatMessage[];
}

const messageSchema = new Schema<AIChatMessage>(
  {
    role: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const chatSessionSchema = new Schema<AIChatSessionDocument>(
  {
    teacherId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true },
    relatedTestInstanceId: { type: Schema.Types.ObjectId, ref: "StudentTestInstance" },
    messages: [messageSchema],
  },
  { timestamps: true }
);

export const AIChatSession: Model<AIChatSessionDocument> =
  mongoose.models.AIChatSession ||
  mongoose.model<AIChatSessionDocument>("AIChatSession", chatSessionSchema);
