import { NextResponse } from "next/server";
import { getEscrowCase, updateEscrowCase } from "@/lib/mock-data/store";
import { logApiCall, logAction, getRequestContext, createTimer } from "@/lib/logger";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const timer = createTimer();
  const requestContext = getRequestContext(request);
  const { id } = await context.params;

  try {
    const escrow = getEscrowCase(id);
    if (!escrow) {
      logAction("rekber_payment_case_not_found", {
        action: "rekber_payment_case_not_found",
        resource: `escrow_${id}`,
        success: false,
        duration: timer.end(),
        context: requestContext
      });

      logApiCall("POST", `/api/rekber/${id}/pay`, 404, timer.end(), requestContext);
      return NextResponse.json({ error: "Rekber case not found" }, { status: 404 });
    }

    const oldStatus = escrow.status;
    const updated = updateEscrowCase(id, { status: "Funds Secured" });

    logAction("escrow_payment_received", {
      action: "escrow_payment_received",
      resource: `escrow_${id}`,
      oldState: { status: oldStatus },
      newState: { status: updated.status, amount: escrow.amount },
      success: true,
      duration: timer.end(),
      context: requestContext
    });

    logApiCall("POST", `/api/rekber/${id}/pay`, 200, timer.end(), requestContext);

    return NextResponse.json({
      escrow: updated,
      message: "Dana diamankan oleh escrow bank. Menunggu pengiriman dari penjual."
    });
  } catch (error) {
    logApiCall("POST", `/api/rekber/${id}/pay`, 500, timer.end(), requestContext);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
