import { NextResponse } from "next/server";
import { calculateRiskScore } from "@/lib/risk-engine";
import { logApiCall, logAction, getRequestContext, createTimer } from "@/lib/logger";

export async function POST(request: Request) {
  const timer = createTimer();
  const context = getRequestContext(request);

  try {
    const body = await request.json();
    const risk = calculateRiskScore({
      accountNumber: String(body.recipientAccount ?? body.accountNumber ?? ""),
      amount: Number(body.amount ?? 0),
      description: String(body.description ?? "Transfer simulation"),
      platform: body.platform ?? "Other",
      senderAccount: body.senderAccount
    });

    const allowed = risk.score <= 60;

    logAction("transfer_simulation", {
      action: "transfer_simulation",
      resource: `transfer_${Date.now()}`,
      newState: {
        recipient_account: body.recipientAccount ?? body.accountNumber,
        amount: body.amount,
        risk_score: risk.score,
        allowed: allowed
      },
      success: true,
      duration: timer.end(),
      context
    });

    logApiCall("POST", "/api/transfer/simulate", 200, timer.end(), context);

    return NextResponse.json({
      risk,
      allowed,
      transferId: allowed ? `SIM-TX-${Date.now()}` : null,
      message:
        risk.score > 60
          ? "Transfer diblokir dalam mode demo karena sinyal fraud tinggi. Rekber Link Bank direkomendasikan."
          : "Simulasi transfer dapat dilanjutkan. Ini hanya data demo."
    });
  } catch (error) {
    logApiCall("POST", "/api/transfer/simulate", 500, timer.end(), context);
    return NextResponse.json({ error: "Failed to simulate transfer" }, { status: 500 });
  }
}
