import { NextResponse } from "next/server";
import { dashboardGraph } from "@/lib/mock-data/store";

export async function GET() {
  return NextResponse.json(dashboardGraph());
}
