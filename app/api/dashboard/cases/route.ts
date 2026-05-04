import { NextResponse } from "next/server";
import { dashboardCases } from "@/lib/mock-data/store";

export async function GET() {
  return NextResponse.json({ cases: dashboardCases() });
}
