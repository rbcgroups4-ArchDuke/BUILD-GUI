import { NextResponse } from "next/server";
import { dashboardSummary, getAuditLogs, listEscrowCases } from "@/lib/mock-data/store";

export async function GET() {
  return NextResponse.json({
    ...dashboardSummary(),
    activeEscrowCases: listEscrowCases().slice(0, 5),
    auditLogs: getAuditLogs()
  });
}
