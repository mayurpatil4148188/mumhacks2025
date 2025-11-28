import mongoose, { Schema, Model } from "mongoose";
import { BaseDocument } from "@/types";

export interface SchoolSettings {
  assessmentFrequencyDays?: number;
  alertThresholds?: Record<string, number>;
  emailNotificationRecipients?: string[];
}

export interface SchoolDocument extends BaseDocument {
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  settings?: SchoolSettings;
  createdByUserId: mongoose.Types.ObjectId;
}

const schoolSchema = new Schema<SchoolDocument>(
  {
    name: { type: String, required: true },
    address: String,
    city: String,
    state: String,
    country: String,
    settings: {
      assessmentFrequencyDays: { type: Number, default: 30 },
      alertThresholds: { type: Schema.Types.Mixed, default: {} },
      emailNotificationRecipients: [String],
    },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const School: Model<SchoolDocument> =
  mongoose.models.School || mongoose.model<SchoolDocument>("School", schoolSchema);
