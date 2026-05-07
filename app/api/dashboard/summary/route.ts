import { NextResponse } from "next/server";
import { dashboardSummary, getAuditLogs, listEscrowCases } from "@/lib/mock-data/store";
import { logApiCall, getRequestContext, createTimer } from "@/lib/logger";

export async function GET(request: Request) {
  const timer = createTimer();
  const context = getRequestContext(request);

  try {
    const data = {
      ...dashboardSummary(),
      activeEscrowCases: listEscrowCases().slice(0, 5),
      auditLogs: getAuditLogs()
    };

    logApiCall("GET", "/api/dashboard/summary", 200, timer.end(), context);
    return NextResponse.json(data);
  } catch (error) {
    logApiCall("GET", "/api/dashboard/summary", 500, timer.end(), context);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
