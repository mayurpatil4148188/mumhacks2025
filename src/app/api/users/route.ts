import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { registerUserSchema } from "@/lib/validators";
import { User } from "@/models/User";
import { dbConnect } from "@/db/connection";
import { normalizeEmail } from "@/lib/utils";
import { getAuthSession, requireRole } from "@/lib/auth";
export async function GET(req: Request) {
  await requireRole(["MASTER_ADMIN", "PRINCIPAL"]);
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role");
  const schoolId = searchParams.get("schoolId");
  const filter: any = {};
  if (role) filter.role = role;
  if (schoolId) filter.schoolId = schoolId;
  const users = await User.find(filter).select("name email role schoolId");
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const session = await getAuthSession();
  const isSelfService = !session;
  if (!isSelfService) {
    await requireRole(["MASTER_ADMIN", "PRINCIPAL"]);
  }
  const json = await req.json();
  const parsed = registerUserSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }
  await dbConnect();
  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const user = await User.create({
    email: normalizeEmail(parsed.data.email),
    passwordHash,
    name: parsed.data.name,
    role: parsed.data.role,
    schoolId: parsed.data.schoolId || null,
  });
  return NextResponse.json({ id: user._id, email: user.email, role: user.role });
}
