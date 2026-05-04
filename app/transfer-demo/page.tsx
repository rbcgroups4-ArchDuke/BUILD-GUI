import { TopNavbar } from "@/components/top-navbar";
import { TransactionSimulator } from "@/components/transaction-simulator";

export default function TransferDemoPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <TopNavbar />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase text-cyan-300">Alur transfer</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal">Simulasi risiko transfer real-time.</h1>
          <p className="mt-4 text-slate-400">Transfer berisiko tinggi diblokir dalam prototipe dan diarahkan ke rekber bank.</p>
        </div>
        <TransactionSimulator />
      </section>
    </main>
  );
}
