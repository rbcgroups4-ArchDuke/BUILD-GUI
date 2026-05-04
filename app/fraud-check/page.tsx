import { AccountCheckForm } from "@/components/account-check-form";
import { TopNavbar } from "@/components/top-navbar";

export default function FraudCheckPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <TopNavbar />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase text-cyan-300">Cek fraud nasabah</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal">Cek apakah rekening aman sebelum transfer.</h1>
          <p className="mt-4 text-slate-400">Coba rekening 1234567890 dengan Rp6.500.000 untuk menjalankan alur demo risiko kritis.</p>
        </div>
        <AccountCheckForm />
      </section>
    </main>
  );
}
