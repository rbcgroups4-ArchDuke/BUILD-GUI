import { NextResponse } from "next/server";
import { createOrUpdateDispute, getEscrowCase } from "@/lib/mock-data/store";

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
  const complaint = String(
    body.complaint ??
      "Paket sudah tiba tetapi barang tidak sesuai invoice. Pembeli meminta pencairan dana ditahan."
  );
  const dispute = createOrUpdateDispute(id, {
    buyerComplaint: complaint,
    evidenceStatus: "Uploaded",
    aiSummary:
      "Pendukung keputusan AI: invoice menyebut iPhone 13, bukti pembeli menunjukkan paket kosong, berat kurir tidak konsisten dengan perkiraan berat barang, dan penjual punya riwayat sengketa.",
    aiRecommendation:
      "Rekomendasi AI: tahan dana dan eskalasi ke staff bank. Keputusan refund, pencairan, pembekuan, atau permintaan bukti harus dibuat oleh staff bank berwenang."
  });
  return NextResponse.json({ dispute });
}
