import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { readReports, writeReports } from "@/store/report-store";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  return NextResponse.json({ id });
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const numericId = parseInt(id);

  const { status, observations } = await req.json();

  const reports = await readReports();
  const index = reports.findIndex((r) => r.id === numericId);

  if (index === -1) {
    return NextResponse.json(
      { error: "Relatório não encontrado" },
      { status: 404 }
    );
  }

  reports[index] = {
    ...reports[index],
    status,
    observations: observations ?? reports[index].observations,
    updatedAt: new Date().toISOString(),
  };

  await writeReports(reports);

  return NextResponse.json(reports[index]);
}

export async function DELETE(
  _: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const numericId = parseInt(id);

  const reports = await readReports();

  const report = reports.find((r) => r.id === numericId);

  if (!report) {
    return NextResponse.json(
      { error: "Relatório não encontrado" },
      { status: 404 }
    );
  }

  const filePath = path.join(process.cwd(), "public", report.fileUrl);

  try {
    await fs.unlink(filePath);
  } catch {
  }

  const updatedReports = reports.filter((r) => r.id !== numericId);

  await writeReports(updatedReports);

  return NextResponse.json({ success: true });
}