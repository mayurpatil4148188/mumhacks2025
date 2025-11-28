import { NextResponse } from "next/server";
import { markFalseAlert } from "@/services/tests";
import { getAuthSession } from "@/lib/auth";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const test = await markFalseAlert(params.id);
    return NextResponse.json({ success: true, test });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
