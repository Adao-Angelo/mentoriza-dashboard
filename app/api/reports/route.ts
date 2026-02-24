import { NextResponse } from "next/server";
import { readReports } from "@/store/report-store";

export async function GET() {
  try {
    const reports = await readReports();
    return NextResponse.json(reports);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar relatórios" }, { status: 500 });
  }
}