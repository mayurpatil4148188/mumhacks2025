import mongoose, { Schema, Model } from "mongoose";
import { BaseDocument } from "@/types";

export interface StudentProfileDocument extends BaseDocument {
  userId: mongoose.Types.ObjectId;
  schoolId: mongoose.Types.ObjectId;
  grade?: string;
  section?: string;
  rollNumber?: string;
  preferences?: Record<string, any>;
}

const studentProfileSchema = new Schema<StudentProfileDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true },
    grade: String,
    section: String,
    rollNumber: String,
    preferences: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const StudentProfile: Model<StudentProfileDocument> =
  mongoose.models.StudentProfile ||
  mongoose.model<StudentProfileDocument>("StudentProfile", studentProfileSchema);
