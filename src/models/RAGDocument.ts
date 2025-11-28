import mongoose, { Schema, Model } from "mongoose";
import { BaseDocument } from "@/types";

export interface RAGDocumentDocument extends BaseDocument {
  schoolId: mongoose.Types.ObjectId;
  studentId?: mongoose.Types.ObjectId | null;
  type: string;
  sourceId?: mongoose.Types.ObjectId | null;
  text: string;
  embedding: number[];
}

const ragDocumentSchema = new Schema<RAGDocumentDocument>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true },
    studentId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    type: { type: String, required: true },
    sourceId: { type: Schema.Types.ObjectId, default: null },
    text: { type: String, required: true },
    embedding: { type: [Number], default: [] },
  },
  { timestamps: true }
);

export const RAGDocument: Model<RAGDocumentDocument> =
  mongoose.models.RAGDocument ||
  mongoose.model<RAGDocumentDocument>("RAGDocument", ragDocumentSchema);
