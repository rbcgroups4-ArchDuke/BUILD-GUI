import { NextResponse } from "next/server";
import { getEscrowCase, updateEscrowCase } from "@/lib/mock-data/store";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const escrow = getEscrowCase(id);
  if (!escrow) {
    return NextResponse.json({ error: "Rekber case not found" }, { status: 404 });
  }
  const updated = updateEscrowCase(id, { status: "Funds Secured" });
  return NextResponse.json({
    escrow: updated,
    message: "Dana diamankan oleh escrow bank. Menunggu pengiriman dari penjual."
  });
}
