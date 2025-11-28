import { NextResponse } from "next/server";
import { Alert } from "@/models/StudentTestInstance";
import { getAuthSession } from "@/lib/auth";
import { dbConnect } from "@/db/connection";
import { isDummyMode } from "@/lib/env";
import { dummyAlerts } from "@/lib/dummy-data";

export async function GET() {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (isDummyMode()) {
    return NextResponse.json(dummyAlerts);
  }

  await dbConnect();
  const alerts = await Alert.find({ schoolId: session.user.schoolId }).sort({ createdAt: -1 });
  return NextResponse.json(alerts);
}

export async function PATCH(req: Request) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (isDummyMode()) {
    const { alertId, status } = await req.json();
    // Return dummy updated alert
    const dummyAlert = dummyAlerts.find((a) => a._id.toString() === alertId);
    if (dummyAlert) {
      return NextResponse.json({ ...dummyAlert, status, acknowledgedBy: session.user.id });
    }
    return NextResponse.json({ error: "Alert not found" }, { status: 404 });
  }

  const { alertId, status } = await req.json();
  await dbConnect();
  const updated = await Alert.findByIdAndUpdate(alertId, {
    status,
    acknowledgedBy: session.user.id,
  });
  return NextResponse.json(updated);
}
