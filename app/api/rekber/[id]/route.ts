import { NextResponse } from "next/server";
import { getDisputeByCaseId, getEscrowCase } from "@/lib/mock-data/store";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const escrow = getEscrowCase(id);
  if (!escrow) {
    return NextResponse.json({ error: "Rekber case not found" }, { status: 404 });
  }
  return NextResponse.json({ escrow, dispute: getDisputeByCaseId(id) ?? null });
}
