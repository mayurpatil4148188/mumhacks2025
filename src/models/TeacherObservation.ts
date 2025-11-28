import mongoose, { Schema, Model } from "mongoose";
import { BaseDocument } from "@/types";

export interface TeacherObservationDocument extends BaseDocument {
  teacherId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  schoolId: mongoose.Types.ObjectId;
  title: string;
  noteText: string;
  attachmentFileIds: mongoose.Types.ObjectId[];
}

const observationSchema = new Schema<TeacherObservationDocument>(
  {
    teacherId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true },
    title: { type: String, required: true },
    noteText: { type: String, required: true },
    attachmentFileIds: [{ type: Schema.Types.ObjectId, ref: "UploadedFile" }],
  },
  { timestamps: true }
);

export const TeacherObservation: Model<TeacherObservationDocument> =
  mongoose.models.TeacherObservation ||
  mongoose.model<TeacherObservationDocument>("TeacherObservation", observationSchema);
