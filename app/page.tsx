import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  Banknote,
  BrainCircuit,
  FileWarning,
  Lock,
  Network,
  Search,
  ShieldCheck,
  Truck,
  Wallet
} from "lucide-react";
import { HeroSection } from "@/components/landing/hero-section";
import { FeatureCard } from "@/components/landing/feature-card";
import { TopNavbar } from "@/components/top-navbar";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AccountGraph } from "@/components/dashboard/account-graph";
import { dashboardGraph } from "@/lib/mock-data/store";

export default function LandingPage() {
  const graph = dashboardGraph();
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <TopNavbar />
      <HeroSection />
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-semibold uppercase text-cyan-300">Masalah</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal">Fraud transaksi segitiga bergerak lebih cepat daripada verifikasi manual.</h2>
          <p className="mt-4 leading-7 text-slate-400">
            Penjual, pembeli, dan rekening mule di social commerce bisa tercampur dalam satu rantai transfer. Nasabah sering hanya melihat nomor rekening sebelum mengirim dana.
          </p>
        </div>
        <div id="features" className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard icon={Search} title="Skor risiko rekening" description="Nasabah dapat mengecek rekening tujuan sebelum transfer memakai aturan demo yang bisa dijelaskan." />
          <FeatureCard icon={Activity} title="FDS Hybrid adaptif" description="Rule-based engine digabung dengan simulasi Isolation Forest untuk membaca anomali perilaku nasabah dan mengurangi false positive." />
          <FeatureCard icon={Network} title="Graf relasi" description="Analis dapat melihat korban, rekening mencurigakan, rekening mule, e-wallet, dan jalur cash-out eksternal." />
          <FeatureCard icon={Wallet} title="Rekber Link Bank" description="Dana ditahan di dompet escrow simulasi bank sampai pengiriman selesai atau sengketa diputus manusia." />
        </div>
      </section>

      <section id="workflow" className="border-y border-slate-500/10 bg-slate-950/55 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase text-cyan-300">Cara kerja</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-normal">Pendukung keputusan transaksi aman dalam empat langkah.</h2>
            </div>
            <Link href="/transfer-demo" className={buttonVariants({ variant: "outline" })}>Buka simulasi transfer</Link>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              ["1", "Cek rekening", "Nasabah memasukkan rekening tujuan, nominal, keterangan, dan sumber platform."],
              ["2", "Nilai risiko", "Aturan menjelaskan kenapa transfer aman, waspada, risiko tinggi, atau kritis."],
              ["3", "Pakai rekber", "Alur berisiko tinggi diarahkan ke rekber bank, bukan transfer langsung."],
              ["4", "Tinjau sengketa", "AI merangkum bukti untuk staff, tetapi keputusan akhir tetap oleh staff."]
            ].map(([step, title, body]) => (
              <Card key={step}>
                <CardContent className="p-5">
                  <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-md bg-cyan-500/15 text-cyan-100">{step}</div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-amber-300" />Pratinjau demo deteksi fraud</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-red-400/20 bg-red-500/10 p-5">
              <p className="font-mono text-sm text-red-100">Rekening ••••••7890</p>
              <p className="mt-3 text-5xl font-semibold">87/100</p>
              <p className="mt-2 text-sm text-red-100">Risiko Kritis</p>
            </div>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>Perilaku cash-out cepat dalam 10 menit.</li>
              <li>Terhubung ke rekening yang pernah dilaporkan.</li>
              <li>Deskripsi transaksi social commerce mirip laporan scam.</li>
            </ul>
          </CardContent>
        </Card>
        <Card id="rekber">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5 text-emerald-300" />Penjelasan Rekber Link</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-slate-300">
            <p>
              Penjual membuat link rekber bank untuk barang tertentu. Pembeli membayar ke dompet escrow simulasi bank, penjual mengirim barang, dan dana hanya dicairkan setelah barang diterima atau sengketa ditinjau staff.
            </p>
            <div className="rounded-md border border-red-400/20 bg-red-500/10 p-4">
              <p className="mb-2 font-semibold text-red-100">Pola scam AI Rekber ikut dideteksi</p>
              <p className="text-slate-300">
                Demo ini menandai pola chat rekber palsu seperti klaim grup rekber, “format transaksi jual beli”, kata noreff/refund, screenshot bukti transfer, dan pesan “dana sudah masuk” yang menekan penjual agar melepas barang atau data akun.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-md border border-slate-500/20 bg-slate-950/35 p-4"><Truck className="mb-2 h-5 w-5 text-cyan-300" />Status kurir memakai data tiruan untuk prototipe.</div>
              <div className="rounded-md border border-slate-500/20 bg-slate-950/35 p-4"><BrainCircuit className="mb-2 h-5 w-5 text-violet-300" />AI hanya pendukung keputusan, bukan otoritas akhir.</div>
            </div>
            <Link href="/rekber/create" className={buttonVariants({ variant: "default" })}>
              <Banknote className="h-4 w-4" />
              Buat Rekber Link
            </Link>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-cyan-300">Pratinjau dashboard</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal">Graf analis untuk relasi rekening mencurigakan.</h2>
          </div>
          <Link href="/dashboard" className={buttonVariants({ variant: "outline", className: "hidden md:inline-flex" })}>
            <FileWarning className="h-4 w-4" />
            Buka dashboard
          </Link>
        </div>
        <AccountGraph nodes={graph.nodes} edges={graph.edges} />
        <div className="mt-4">
          <Link href="/dashboard/hybrid-fds" className={buttonVariants({ variant: "default" })}>
            <Activity className="h-4 w-4" />
            Buka Modul FDS Hybrid
          </Link>
        </div>
      </section>
      <footer className="border-t border-slate-500/10 py-8 text-center text-sm text-slate-500">
        Dirancang untuk pencegahan fraud. Data demo saja. Tidak ada integrasi bank nyata.
      </footer>
    </main>
  );
}
