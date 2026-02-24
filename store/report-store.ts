import fs from "fs/promises";
import path from "path";
import { Report } from "@/services/reports/Interfaces";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "reports.json");

async function ensureFile() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify([]));
  }
}

export async function readReports(): Promise<Report[]> {
  await ensureFile();
  const data = await fs.readFile(dataFile, "utf-8");
  return JSON.parse(data);
}

export async function writeReports(reports: Report[]) {
  await fs.writeFile(dataFile, JSON.stringify(reports, null, 2));
}