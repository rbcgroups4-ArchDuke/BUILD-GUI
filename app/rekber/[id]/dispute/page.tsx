import { notFound } from "next/navigation";
import { TopNavbar } from "@/components/top-navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DisputeForm } from "@/components/dispute-form";
import { getDisputeByCaseId, getEscrowCase } from "@/lib/mock-data/store";

export default async function DisputePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const escrow = getEscrowCase(id);
  if (!escrow) notFound();
  const dispute = getDisputeByCaseId(id);
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <TopNavbar />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase text-cyan-300">Sengketa pembeli</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal">Tahan pencairan dan minta tinjauan staff.</h1>
          <p className="mt-4 text-slate-400">AI merangkum bukti hanya sebagai pendukung keputusan. Staff bank berwenang membuat keputusan akhir.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{escrow.itemName}</CardTitle>
          </CardHeader>
          <CardContent>
            <DisputeForm escrow={escrow} initialDispute={dispute} />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
