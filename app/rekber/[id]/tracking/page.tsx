import { notFound } from "next/navigation";
import { TopNavbar } from "@/components/top-navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrackingForm } from "@/components/tracking-form";
import { getEscrowCase } from "@/lib/mock-data/store";

export default async function TrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const escrow = getEscrowCase(id);
  if (!escrow) notFound();
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <TopNavbar />
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase text-cyan-300">Pengiriman penjual</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal">Pelacakan kurir untuk {escrow.caseId}</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Status kurir tiruan</CardTitle>
          </CardHeader>
          <CardContent>
            <TrackingForm escrow={escrow} />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
