import mongoose, { Schema, Model } from "mongoose";
import { BaseDocument } from "@/types";

export interface TeacherProfileDocument extends BaseDocument {
  userId: mongoose.Types.ObjectId;
  schoolId: mongoose.Types.ObjectId;
  assignedGrades: string[];
  assignedSections: string[];
}

const teacherProfileSchema = new Schema<TeacherProfileDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true },
    assignedGrades: [String],
    assignedSections: [String],
  },
  { timestamps: true }
);

export const TeacherProfile: Model<TeacherProfileDocument> =
  mongoose.models.TeacherProfile ||
  mongoose.model<TeacherProfileDocument>("TeacherProfile", teacherProfileSchema);
