import { NextResponse } from "next/server";
import { dashboardGraph } from "@/lib/mock-data/store";
import { logApiCall, getRequestContext, createTimer } from "@/lib/logger";

export async function GET(request: Request) {
  const timer = createTimer();
  const context = getRequestContext(request);

  try {
    const data = dashboardGraph();

    logApiCall("GET", "/api/dashboard/graph", 200, timer.end(), context);
    return NextResponse.json(data);
  } catch (error) {
    logApiCall("GET", "/api/dashboard/graph", 500, timer.end(), context);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
