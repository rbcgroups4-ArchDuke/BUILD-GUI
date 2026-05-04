import { NextResponse } from "next/server";
import { getEscrowCase, updateEscrowCase } from "@/lib/mock-data/store";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await request.json();
  const escrow = getEscrowCase(id);
  if (!escrow) {
    return NextResponse.json({ error: "Rekber case not found" }, { status: 404 });
  }
  const updated = updateEscrowCase(id, {
    trackingNumber: String(body.trackingNumber ?? "TRK-DEMO-2026"),
    status: body.markDelivered ? "Delivered" : "In Transit"
  });
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
}
