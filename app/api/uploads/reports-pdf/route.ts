import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
import { readReports, writeReports } from "@/store/report-store";
import { Report } from "@/services/reports/Interfaces";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const groupIdStr = formData.get("groupId") as string | null;

    if (!file || !groupIdStr)
      return NextResponse.json({ error: "Faltam dados" }, { status: 400 });

    if (file.type !== "application/pdf")
      return NextResponse.json({ error: "Apenas PDF" }, { status: 400 });

    const groupId = parseInt(groupIdStr);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public/uploads");
    const groupDir = path.join(uploadDir, `group-${groupId}`);
    await fs.mkdir(groupDir, { recursive: true });

    const uniqueName = `${crypto.randomUUID()}-${file.name.replace(
      /[^a-zA-Z0-9.-]/g,
      "_"
    )}`;

    const filePath = path.join(groupDir, uniqueName);
    await fs.writeFile(filePath, buffer);

    const reports = await readReports();
    const newId = reports.length > 0 ? Math.max(...reports.map(r => r.id)) + 1 : 1;

    const newReport: Report = {
      id: newId,
      groupId,
      submissionId: 0,
      fileUrl: `/uploads/group-${groupId}/${uniqueName}`,
      publicId: uniqueName,
      title: file.name.replace(".pdf", ""),
      status: "under_review",
      score: 0,
      observations: "",
      keyResults: { aiContent: 0, abntCompliance: 0, plagiarism: 0 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      theme: undefined
    };

    reports.push(newReport);
    await writeReports(reports);

    return NextResponse.json(newReport);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}