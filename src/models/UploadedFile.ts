import mongoose, { Schema, Model } from "mongoose";
import { BaseDocument } from "@/types";

export interface UploadedFileDocument extends BaseDocument {
  schoolId: mongoose.Types.ObjectId;
  uploadedByUserId: mongoose.Types.ObjectId;
  studentId?: mongoose.Types.ObjectId;
  originalFilename: string;
  storedPath: string;
  mimeType: string;
  aiSummary?: string;
}

const uploadedFileSchema = new Schema<UploadedFileDocument>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true },
    uploadedByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    studentId: { type: Schema.Types.ObjectId, ref: "User" },
    originalFilename: { type: String, required: true },
    storedPath: { type: String, required: true },
    mimeType: { type: String, required: true },
    aiSummary: String,
  },
  { timestamps: true }
);

export const UploadedFile: Model<UploadedFileDocument> =
  mongoose.models.UploadedFile ||
  mongoose.model<UploadedFileDocument>("UploadedFile", uploadedFileSchema);
