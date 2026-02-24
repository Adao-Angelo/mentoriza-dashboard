import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { readReports, writeReports } from "@/store/report-store";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const reports = await readReports();

  const report = reports.find(r => r.id === id);
  if (!report)
    return NextResponse.json({ error: "Relatório não encontrado" }, { status: 404 });

  return NextResponse.json(report);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const { status, observations } = await req.json();

  const reports = await readReports();
  const index = reports.findIndex(r => r.id === id);

  if (index === -1)
    return NextResponse.json({ error: "Relatório não encontrado" }, { status: 404 });

  reports[index] = {
    ...reports[index],
    status,
    observations: observations ?? reports[index].observations,
    updatedAt: new Date().toISOString(),
  };

  await writeReports(reports);
  return NextResponse.json(reports[index]);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const reports = await readReports();

  const report = reports.find(r => r.id === id);
  if (!report)
    return NextResponse.json({ error: "Relatório não encontrado" }, { status: 404 });

  const filePath = path.join(process.cwd(), "public", report.fileUrl);

  try {
    await fs.unlink(filePath);
  } catch {}

  const updatedReports = reports.filter(r => r.id !== id);
  await writeReports(updatedReports);

  return NextResponse.json({ success: true });
}