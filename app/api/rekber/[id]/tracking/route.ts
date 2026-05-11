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
    const body = await request.json();
    const escrow = getEscrowCase(id);

    if (!escrow) {
      logApiCall("POST", `/api/rekber/${id}/tracking`, 404, timer.end(), requestContext);
      return NextResponse.json({ error: "Rekber case not found" }, { status: 404 });
    }

    const oldStatus = escrow.status;
    const newStatus = body.markDelivered ? "Delivered" : "In Transit";
    const updated = updateEscrowCase(id, {
      trackingNumber: String(body.trackingNumber ?? "TRK-DEMO-2026"),
      status: newStatus
    });

    if (!updated) {
      logApiCall("POST", `/api/rekber/${id}/tracking`, 500, timer.end(), requestContext);
      return NextResponse.json({ error: "Failed to update rekber case" }, { status: 500 });
    }

    logAction("tracking_update", {
      action: "tracking_update",
      resource: `escrow_${id}`,
      oldState: { status: oldStatus, tracking: escrow.trackingNumber },
      newState: { status: newStatus, tracking: updated.trackingNumber },
      success: true,
      duration: timer.end(),
      context: requestContext
    });

    logApiCall("POST", `/api/rekber/${id}/tracking`, 200, timer.end(), requestContext);

    return NextResponse.json({
      escrow: updated,
      timeline: [
        "Menunggu pengiriman",
        "Dalam pengiriman",
        "Terkirim",
        "Menunggu konfirmasi pembeli 24 jam",
        "Menunggu rilis otomatis",
        "Dicairkan ke penjual"
      ]
    });
  } catch (error) {
    logApiCall("POST", `/api/rekber/${id}/tracking`, 500, timer.end(), requestContext);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
