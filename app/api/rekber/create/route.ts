import { NextResponse } from "next/server";
import { createEscrowCase } from "@/lib/mock-data/store";
import { logApiCall, logAction, getRequestContext, createTimer } from "@/lib/logger";

export async function POST(request: Request) {
  const timer = createTimer();
  const context = getRequestContext(request);

  try {
    const body = await request.json();
    const amount = Number(body.amount ?? body.itemPrice ?? 0);
    const escrowFee = Number(body.escrowFee ?? Math.max(25000, Math.round(amount * 0.01)));
    const escrow = createEscrowCase({
      itemName: String(body.itemName ?? "Secure escrow item"),
      itemDescription: String(body.itemDescription ?? body.itemDescription ?? "Bank-operated escrow simulation item."),
      sellerUsername: String(body.sellerUsername ?? "facebook.com/seller"),
      buyerUsername: String(body.buyerUsername ?? "facebook.com/buyer"),
      sellerAccount: String(body.sellerAccount ?? "1234567890"),
      buyerAccount: String(body.buyerAccount ?? "6611223344"),
      amount,
      escrowFee,
      courier: body.courier ?? "JNE",
      trackingNumber: undefined
    });

    logAction("rekber_case_created", {
      action: "rekber_case_created",
      resource: `escrow_${escrow.caseId}`,
      newState: {
        case_id: escrow.caseId,
        item: body.itemName,
        amount: amount,
        seller: body.sellerUsername,
        buyer: body.buyerUsername,
        status: escrow.status
      },
      success: true,
      duration: timer.end(),
      context
    });

    logApiCall("POST", "/api/rekber/create", 200, timer.end(), context);

    return NextResponse.json({
      escrow,
      link: `/rekber/${escrow.caseId}`,
      publicUrl: `https://maist.demo/rekber/${escrow.caseId}`
    });
  } catch (error) {
    logApiCall("POST", "/api/rekber/create", 500, timer.end(), context);
    return NextResponse.json({ error: "Failed to create rekber case" }, { status: 500 });
  }
}
