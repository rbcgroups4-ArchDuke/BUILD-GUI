import { NextResponse } from "next/server";
import { calculateRiskScore } from "@/lib/risk-engine";
import { logApiCall, logAction, getRequestContext, createTimer } from "@/lib/logger";

export async function POST(request: Request) {
  const timer = createTimer();
  const context = getRequestContext(request);

  try {
    const body = await request.json();
    const result = calculateRiskScore({
      accountNumber: String(body.accountNumber ?? ""),
      amount: Number(body.amount ?? 0),
      description: String(body.description ?? ""),
      platform: body.platform ?? "Other",
      senderAccount: body.senderAccount
    });

    logAction("fraud_risk_check", {
      action: "fraud_risk_check",
      resource: `account_${body.accountNumber}`,
      newState: {
        risk_score: result.score,
        risk_level: result.level,
        amount: body.amount
      },
      success: true,
      duration: timer.end(),
      context
    });

    logApiCall("POST", "/api/risk/check", 200, timer.end(), context);
    return NextResponse.json(result);
  } catch (error) {
    logApiCall("POST", "/api/risk/check", 500, timer.end(), context);
    return NextResponse.json({ error: "Failed to calculate risk" }, { status: 500 });
  }
}
