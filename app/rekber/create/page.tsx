import { RekberCreateForm } from "@/components/rekber/rekber-create-form";
import { TopNavbar } from "@/components/layout/top-navbar";

export default function RekberCreatePage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <TopNavbar />
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase text-cyan-300">Alur penjual</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal">Buat Rekber Link yang dikelola bank.</h1>
          <p className="mt-4 text-slate-400">Prototipe ini membuat kasus escrow tiruan dan halaman pembayaran aman untuk pembeli.</p>
        </div>
        <RekberCreateForm />
      </section>
    </main>
  );
}
