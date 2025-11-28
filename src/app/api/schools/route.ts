import { NextResponse } from "next/server";
import { createSchoolSchema } from "@/lib/validators";
import { School } from "@/models/School";
import { requireRole } from "@/lib/auth";
import { dbConnect } from "@/db/connection";

export async function GET() {
  await dbConnect();
  const schools = await School.find({});
  return NextResponse.json(schools);
}

export async function POST(req: Request) {
  await requireRole("MASTER_ADMIN");
  const body = await req.json();
  const parsed = createSchoolSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }
  await dbConnect();
  const school = await School.create({
    ...parsed.data,
    settings: {
      assessmentFrequencyDays: parsed.data.assessmentFrequencyDays ?? 30,
      alertThresholds: {},
    },
    createdByUserId: body.createdByUserId,
  });
  return NextResponse.json(school);
}
