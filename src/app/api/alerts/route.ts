import { NextResponse } from "next/server";
import { Alert } from "@/models/StudentTestInstance";
import { getAuthSession } from "@/lib/auth";
import { dbConnect } from "@/db/connection";

export async function GET() {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await dbConnect();
  const alerts = await Alert.find({ schoolId: session.user.schoolId }).sort({ createdAt: -1 });
  return NextResponse.json(alerts);
}

export async function PATCH(req: Request) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { alertId, status } = await req.json();
  await dbConnect();
  const updated = await Alert.findByIdAndUpdate(alertId, {
    status,
    acknowledgedBy: session.user.id,
  });
  return NextResponse.json(updated);
}
