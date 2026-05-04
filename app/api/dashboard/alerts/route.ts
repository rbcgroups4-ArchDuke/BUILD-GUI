import { NextResponse } from "next/server";
import { dashboardAlerts } from "@/lib/mock-data/store";

export async function GET() {
  return NextResponse.json({ alerts: dashboardAlerts() });
}
