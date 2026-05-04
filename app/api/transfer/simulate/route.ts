import { NextResponse } from "next/server";
import { calculateRiskScore } from "@/lib/risk-engine";

export async function POST(request: Request) {
  const body = await request.json();
  const risk = calculateRiskScore({
    accountNumber: String(body.recipientAccount ?? body.accountNumber ?? ""),
    amount: Number(body.amount ?? 0),
    description: String(body.description ?? "Transfer simulation"),
    platform: body.platform ?? "Other",
    senderAccount: body.senderAccount
  });

  return NextResponse.json({
    risk,
    allowed: risk.score <= 60,
    transferId: risk.score <= 60 ? `SIM-TX-${Date.now()}` : null,
    message:
      risk.score > 60
        ? "Transfer diblokir dalam mode demo karena sinyal fraud tinggi. Rekber Link Bank direkomendasikan."
        : "Simulasi transfer dapat dilanjutkan. Ini hanya data demo."
  });
}
