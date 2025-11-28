import mongoose, { Schema, Model } from "mongoose";
import { BaseDocument, Role } from "@/types";

export interface UserDocument extends BaseDocument {
  email: string;
  passwordHash: string;
  name: string;
  role: Role;
  schoolId?: mongoose.Types.ObjectId | null;
}

const userSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["MASTER_ADMIN", "PRINCIPAL", "TEACHER", "PARENT", "STUDENT"], required: true },
    schoolId: { type: Schema.Types.ObjectId, ref: "School", default: null },
  },
  { timestamps: true }
);

export const User: Model<UserDocument> =
  mongoose.models.User || mongoose.model<UserDocument>("User", userSchema);
