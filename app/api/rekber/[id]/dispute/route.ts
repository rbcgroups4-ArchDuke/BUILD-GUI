import { NextResponse } from "next/server";
import { createOrUpdateDispute, getEscrowCase } from "@/lib/mock-data/store";
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
      logApiCall("POST", `/api/rekber/${id}/dispute`, 404, timer.end(), requestContext);
      return NextResponse.json({ error: "Rekber case not found" }, { status: 404 });
    }

    const complaint = String(
      body.complaint ??
        "Paket sudah tiba tetapi barang tidak sesuai invoice. Pembeli meminta pencairan dana ditahan."
    );
    const dispute = createOrUpdateDispute(id, {
      buyerComplaint: complaint,
      evidenceStatus: "Uploaded",
      aiSummary:
        "Pendukung keputusan mAIst: invoice menyebut iPhone 13, bukti pembeli menunjukkan paket kosong, berat kurir tidak konsisten dengan perkiraan berat barang, dan penjual punya riwayat sengketa.",
      aiRecommendation:
        "Rekomendasi mAIst: tahan dana dan eskalasi ke staff bank. Keputusan refund, pencairan, pembekuan, atau permintaan bukti harus dibuat oleh staff bank berwenang."
    });

    logAction("dispute_filed", {
      action: "dispute_filed",
      resource: `dispute_${id}`,
      newState: {
        case_id: id,
        complaint_summary: complaint.slice(0, 100),
        status: "open"
      },
      success: true,
      duration: timer.end(),
      context: requestContext
    });

    logApiCall("POST", `/api/rekber/${id}/dispute`, 200, timer.end(), requestContext);
    return NextResponse.json({ dispute });
  } catch (error) {
    logApiCall("POST", `/api/rekber/${id}/dispute`, 500, timer.end(), requestContext);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
