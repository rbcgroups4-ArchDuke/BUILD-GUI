import { NextResponse } from "next/server";
import { calculateRiskScore } from "@/lib/risk-engine";

export async function POST(request: Request) {
  const body = await request.json();
  const result = calculateRiskScore({
    accountNumber: String(body.accountNumber ?? ""),
    amount: Number(body.amount ?? 0),
    description: String(body.description ?? ""),
    platform: body.platform ?? "Other",
    senderAccount: body.senderAccount
  });
  return NextResponse.json(result);
}
