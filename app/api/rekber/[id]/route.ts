import { NextResponse } from "next/server";
import { getDisputeByCaseId, getEscrowCase } from "@/lib/mock-data/store";
import { logApiCall, logAction, getRequestContext, createTimer } from "@/lib/logger";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const timer = createTimer();
  const requestContext = getRequestContext(request);
  const { id } = await context.params;

  try {
    const escrow = getEscrowCase(id);
    if (!escrow) {
      logAction("rekber_case_not_found", {
        action: "rekber_case_not_found",
        resource: `escrow_${id}`,
        success: false,
        duration: timer.end(),
        context: requestContext
      });

      logApiCall("GET", `/api/rekber/${id}`, 404, timer.end(), requestContext);
      return NextResponse.json({ error: "Rekber case not found" }, { status: 404 });
    }

    logAction("rekber_case_accessed", {
      action: "rekber_case_accessed",
      resource: `escrow_${id}`,
      newState: { case_id: id, status: escrow.status },
      success: true,
      duration: timer.end(),
      context: requestContext
    });

    logApiCall("GET", `/api/rekber/${id}`, 200, timer.end(), requestContext);
    return NextResponse.json({ escrow, dispute: getDisputeByCaseId(id) ?? null });
  } catch (error) {
    logApiCall("GET", `/api/rekber/${id}`, 500, timer.end(), requestContext);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
