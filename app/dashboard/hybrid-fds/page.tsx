import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { LazyHybridFdsLab } from "@/components/dashboard/lazy-hybrid-fds-lab";
import { TopNavbar } from "@/components/layout/top-navbar";

export default function HybridFdsPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <TopNavbar mode="dashboard" />
      <div className="flex">
        <DashboardSidebar active="/dashboard/hybrid-fds" />
        <section className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase text-cyan-300">FDS Hybrid</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal">Rule-Based + Isolation Forest untuk skor risiko adaptif.</h1>
            <p className="mt-4 max-w-3xl text-slate-400">
              Modul ini menambahkan fitur dari proposal: ekstraksi fitur perilaku nasabah, skor anomali historis, final risk score gabungan, Explainable AI, auto stream transaksi, dan aksi analis untuk menekan false positive.
            </p>
          </div>
          <LazyHybridFdsLab />
        </section>
      </div>
    </main>
  );
}
