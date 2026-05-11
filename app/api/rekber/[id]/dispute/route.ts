import { NextResponse } from "next/server";
import { generateDisputeDecisionSupport } from "@/lib/ai/rekber-assistant";
import { createOrUpdateDispute, getEscrowCase, getRekberChatMessages } from "@/lib/mock-data/store";
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
    const decisionSupport = await generateDisputeDecisionSupport({
      escrow,
      complaint,
      recentMessages: getRekberChatMessages(id) ?? []
    });
    const dispute = createOrUpdateDispute(id, {
      buyerComplaint: complaint,
      evidenceStatus: "Uploaded",
      aiSummary:
        decisionSupport?.summary ??
        "Pendukung keputusan mAIst: komplain pembeli, status transaksi, dan konteks chat menunjukkan dana perlu ditahan sampai bukti ditinjau staff bank.",
      aiRecommendation:
        decisionSupport?.recommendation ??
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
