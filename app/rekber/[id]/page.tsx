import Link from "next/link";
import { notFound } from "next/navigation";
import { Bot, ShieldCheck, Truck, MessageSquare } from "lucide-react";
import { TopNavbar } from "@/components/top-navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { RekberPaymentPanel } from "@/components/rekber-payment-panel";
import { StatusBadge } from "@/components/status-badge";
import { formatDateTime, formatRupiah, maskAccount } from "@/lib/utils";
import { getEscrowCase } from "@/lib/mock-data/store";

export default async function RekberPaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const escrow = getEscrowCase(id);
  if (!escrow) notFound();
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <TopNavbar />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase text-cyan-300">Buyer payment page</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal">{escrow.itemName}</h1>
            <p className="mt-3 font-mono text-sm text-slate-400">{escrow.caseId}</p>
          </div>
          <StatusBadge status={escrow.status} />
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <Card>
            <CardHeader>
            <CardTitle>Detail barang dan penjual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="aspect-video rounded-lg border border-slate-500/20 bg-[radial-gradient(circle_at_30%_20%,rgba(6,182,212,.25),transparent_25%),linear-gradient(135deg,rgba(37,99,235,.15),rgba(16,185,129,.08))]" />
              <p className="text-slate-300">{escrow.itemDescription}</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-md border border-slate-500/20 bg-slate-950/35 p-4">
                  <p className="text-xs uppercase text-slate-500">Penjual</p>
                  <p>{escrow.sellerUsername}</p>
                  <p className="font-mono text-xs text-slate-400">{maskAccount(escrow.sellerAccount)}</p>
                </div>
                <div className="rounded-md border border-slate-500/20 bg-slate-950/35 p-4">
                  <p className="text-xs uppercase text-slate-500">Pembeli</p>
                  <p>{escrow.buyerUsername}</p>
                  <p className="font-mono text-xs text-slate-400">{maskAccount(escrow.buyerAccount)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan pembayaran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-slate-400">Harga barang</span><span>{formatRupiah(escrow.amount)}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Biaya rekber</span><span>{formatRupiah(escrow.escrowFee)}</span></div>
                <div className="flex justify-between border-t border-slate-500/10 pt-3 text-lg font-semibold"><span>Total pembayaran</span><span>{formatRupiah(escrow.amount + escrow.escrowFee)}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Batas pencairan</span><span>{formatDateTime(escrow.releaseDeadline)}</span></div>
              </div>
              <RekberPaymentPanel escrow={escrow} />
              <div className="grid gap-2 sm:grid-cols-2">
                <Link href={`/rekber/${escrow.caseId}/chat`} className={buttonVariants({ variant: "default" })}>
                  <Bot className="h-4 w-4" />
                  Chat mAIst
                </Link>
                <Link href={`/rekber/${escrow.caseId}/tracking`} className={buttonVariants({ variant: "outline" })}>
                  <Truck className="h-4 w-4" />
                  Pelacakan
                </Link>
                <Link href={`/rekber/${escrow.caseId}/dispute`} className={buttonVariants({ variant: "outline" })}>
                  <MessageSquare className="h-4 w-4" />
                  Sengketa
                </Link>
              </div>
              <p className="flex gap-2 text-xs text-slate-500">
                <ShieldCheck className="h-4 w-4 flex-none" />
                Dompet escrow bank disimulasikan. Tidak ada jalur pembayaran nyata yang terhubung.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
