import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { UploadedFile } from "@/models/UploadedFile";
import { getAuthSession } from "@/lib/auth";
import { dbConnect } from "@/db/connection";

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const studentId = formData.get("studentId") as string | null;
  if (!file) return NextResponse.json({ error: "File missing" }, { status: 400 });

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const uploadsDir = path.join(process.cwd(), "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });
  const storedPath = path.join(uploadsDir, `${Date.now()}-${file.name}`);
  await fs.writeFile(storedPath, buffer);

  await dbConnect();
  const saved = await UploadedFile.create({
    schoolId: session.user.schoolId,
    uploadedByUserId: session.user.id,
    studentId,
    originalFilename: file.name,
    storedPath,
    mimeType: file.type,
  });

  return NextResponse.json(saved);
}
