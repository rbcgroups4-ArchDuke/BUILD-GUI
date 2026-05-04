import { NextResponse } from "next/server";
import { createEscrowCase } from "@/lib/mock-data/store";

export async function POST(request: Request) {
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
  return NextResponse.json({
    escrow,
    link: `/rekber/${escrow.caseId}`,
    publicUrl: `https://fraudguard.demo/rekber/${escrow.caseId}`
  });
}
