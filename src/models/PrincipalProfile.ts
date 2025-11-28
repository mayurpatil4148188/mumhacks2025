import mongoose, { Schema, Model } from "mongoose";
import { BaseDocument } from "@/types";

export interface PrincipalProfileDocument extends BaseDocument {
  userId: mongoose.Types.ObjectId;
  schoolId: mongoose.Types.ObjectId;
}

const principalProfileSchema = new Schema<PrincipalProfileDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true },
  },
  { timestamps: true }
);

export const PrincipalProfile: Model<PrincipalProfileDocument> =
  mongoose.models.PrincipalProfile ||
  mongoose.model<PrincipalProfileDocument>("PrincipalProfile", principalProfileSchema);
