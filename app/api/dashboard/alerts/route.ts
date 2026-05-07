import { NextResponse } from "next/server";
import { dashboardAlerts } from "@/lib/mock-data/store";
import { logApiCall, getRequestContext, createTimer } from "@/lib/logger";

export async function GET(request: Request) {
  const timer = createTimer();
  const context = getRequestContext(request);

  try {
    const data = { alerts: dashboardAlerts() };

    logApiCall("GET", "/api/dashboard/alerts", 200, timer.end(), context);
    return NextResponse.json(data);
  } catch (error) {
    logApiCall("GET", "/api/dashboard/alerts", 500, timer.end(), context);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
