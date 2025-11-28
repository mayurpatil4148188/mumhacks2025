import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { Role } from "@/types";

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type RouteHandler = (req: Request) => Promise<NextResponse>;

export function withErrorHandling(handler: RouteHandler): RouteHandler {
  return async (req: Request) => {
    try {
      return await handler(req);
    } catch (error: any) {
      if (error instanceof HttpError) {
        return NextResponse.json({ error: error.message }, { status: error.status });
      }
      console.error("Unhandled route error:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  };
}

export async function requireStudentSession() {
  const session = await getAuthSession();
  if (!session) throw new HttpError(401, "Unauthorized");
  if (session.user.role !== "STUDENT") throw new HttpError(403, "Forbidden");
  if (!session.user.schoolId) throw new HttpError(400, "School not found for user");
  return session;
}

export async function requireRoleSession(role: Role | Role[]) {
  const session = await getAuthSession();
  if (!session) throw new HttpError(401, "Unauthorized");
  const allowed = Array.isArray(role) ? role : [role];
  if (!allowed.includes(session.user.role)) throw new HttpError(403, "Forbidden");
  return session;
}
