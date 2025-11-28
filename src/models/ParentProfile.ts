import mongoose, { Schema, Model } from "mongoose";
import { BaseDocument } from "@/types";

export interface ParentProfileDocument extends BaseDocument {
  userId: mongoose.Types.ObjectId;
  schoolId: mongoose.Types.ObjectId;
  linkedStudentIds: mongoose.Types.ObjectId[];
}

const parentProfileSchema = new Schema<ParentProfileDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true },
    linkedStudentIds: [{ type: Schema.Types.ObjectId, ref: "StudentProfile" }],
  },
  { timestamps: true }
);

export const ParentProfile: Model<ParentProfileDocument> =
  mongoose.models.ParentProfile ||
  mongoose.model<ParentProfileDocument>("ParentProfile", parentProfileSchema);
