import { NextResponse } from "next/server";
import { observationSchema } from "@/lib/validators";
import { TeacherObservation } from "@/models/TeacherObservation";
import { getAuthSession } from "@/lib/auth";
import { dbConnect } from "@/db/connection";

export async function GET(req: Request) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");
  await dbConnect();
  const obs = await TeacherObservation.find({
    schoolId: session.user.schoolId,
    ...(studentId ? { studentId } : {}),
  });
  return NextResponse.json(obs);
}

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = observationSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }
  await dbConnect();
  const created = await TeacherObservation.create({
    ...parsed.data,
    teacherId: session.user.id,
    schoolId: session.user.schoolId,
    attachmentFileIds: [],
  });
  return NextResponse.json(created);
}
