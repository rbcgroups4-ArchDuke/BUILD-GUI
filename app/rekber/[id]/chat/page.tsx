import { notFound } from "next/navigation";
import { TopNavbar } from "@/components/top-navbar";
import { RekberChatRoom } from "@/components/rekber-chat-room";
import { getEscrowCase, getRekberChatMessages } from "@/lib/mock-data/store";

export default async function RekberChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const escrow = getEscrowCase(id);
  if (!escrow) notFound();
  const messages = getRekberChatMessages(id) ?? [];

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <TopNavbar />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase text-cyan-300">Chat mAIst</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal">Ruang chat resmi penjual, pembeli, dan mAIst.</h1>
          <p className="mt-4 text-slate-400">
            mAIst menjadi penengah otomatis, memberi arahan aman, dan mencegah pelepasan barang/data sebelum dana aman di escrow bank.
          </p>
        </div>
        <RekberChatRoom escrow={escrow} initialMessages={messages} />
      </section>
    </main>
  );
}
