import { z } from "zod";
import { Domain } from "@/types";

export const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerUserSchema = credentialsSchema.extend({
  name: z.string().min(2),
  role: z.enum(["MASTER_ADMIN", "PRINCIPAL", "TEACHER", "PARENT", "STUDENT"]),
  schoolId: z.string().optional(),
});

export const createSchoolSchema = z.object({
  name: z.string().min(2),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  assessmentFrequencyDays: z.number().optional(),
});

export const startTestSchema = z.object({
  studentId: z.string(),
  schoolId: z.string(),
});

export const submitTestSchema = z.object({
  testInstanceId: z.string(),
  answers: z.array(
    z.object({
      questionId: z.string(),
      answerValue: z.number().min(1).max(5),
    })
  ),
});

export const observationSchema = z.object({
  title: z.string().min(2),
  noteText: z.string().min(4),
  studentId: z.string(),
});

export const chatMessageSchema = z.object({
  studentId: z.string(),
  teacherId: z.string(),
  schoolId: z.string(),
  message: z.string().min(2),
  relatedTestInstanceId: z.string().optional(),
});

export const domainList: Domain[] = [
  "Bullying",
  "Self-harm risk",
  "Family stress",
  "Academic pressure",
  "Social isolation",
  "Trauma",
  "Neglect",
  "Eating disorders",
];
