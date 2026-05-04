"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Bot, Loader2, Lock, Send, ShieldCheck, UserRound, Wallet } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { statusLabel } from "@/lib/i18n";
import { formatDateTime, formatRupiah } from "@/lib/utils";
import type { ChatSenderRole, EscrowCase, RekberChatMessage } from "@/types";

export function RekberChatRoom({
  escrow,
  initialMessages
}: {
  escrow: EscrowCase;
  initialMessages: RekberChatMessage[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [senderRole, setSenderRole] = useState<Exclude<ChatSenderRole, "ai">>("buyer");
  const [message, setMessage] = useState("Saya sudah transfer, ini bukti transfernya. Apakah penjual boleh kirim data akun?");
  const [loading, setLoading] = useState(false);

  const officialStatus = useMemo(() => {
    const secured = ["Funds Secured", "Waiting Shipment", "In Transit", "Delivered", "Waiting Buyer Confirmation", "Auto-release Pending"].includes(escrow.status);
    return secured
      ? "Dana sudah tercatat aman di escrow bank."
      : "Dana belum tercatat aman. Jangan kirim barang/data dulu.";
  }, [escrow.status]);

  async function sendMessage(event: React.FormEvent) {
    event.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    const response = await fetch(`/api/rekber/${escrow.caseId}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senderRole, message })
    });
    const data = await response.json();
    setMessages(data.messages ?? messages);
    setMessage("");
    setLoading(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <Card className="overflow-hidden">
        <CardHeader className="border-b border-slate-500/10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-cyan-300" />
                Chat Transaksi mAIst
              </CardTitle>
              <p className="mt-2 text-sm text-slate-400">
                mAIst menjadi penengah otomatis antara penjual dan pembeli.
              </p>
            </div>
            <Badge variant={escrow.status === "Funds Secured" ? "success" : "warning"}>{statusLabel(escrow.status)}</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[620px] space-y-4 overflow-y-auto bg-slate-950/35 p-5">
            {messages.map((item) => {
              const isAi = item.senderRole === "ai";
              const isSeller = item.senderRole === "seller";
              return (
                <div
                  key={item.messageId}
                  className={`flex gap-3 ${isAi ? "justify-start" : isSeller ? "justify-end" : "justify-start"}`}
                >
                  {!isSeller && (
                    <div className={`flex h-9 w-9 flex-none items-center justify-center rounded-full ${isAi ? "bg-cyan-500/15 text-cyan-200" : "bg-blue-500/15 text-blue-200"}`}>
                      {isAi ? <Bot className="h-4 w-4" /> : <UserRound className="h-4 w-4" />}
                    </div>
                  )}
                  <div className={`max-w-[78%] rounded-lg border p-4 ${isAi ? "border-cyan-400/20 bg-cyan-500/10" : isSeller ? "border-emerald-400/20 bg-emerald-500/10" : "border-blue-400/20 bg-blue-500/10"}`}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold">{item.senderName}</p>
                      <p className="text-[11px] text-slate-500">{formatDateTime(item.timestamp)}</p>
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-6 text-slate-200">{item.message}</p>
                  </div>
                  {isSeller && (
                    <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-emerald-500/15 text-emerald-200">
                      <UserRound className="h-4 w-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <form onSubmit={sendMessage} className="border-t border-slate-500/10 p-5">
            <div className="mb-3 flex flex-wrap gap-2">
              {(["buyer", "seller"] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSenderRole(role)}
                  className={`rounded-md border px-3 py-2 text-sm transition ${senderRole === role ? "border-cyan-400/40 bg-cyan-500/15 text-cyan-100" : "border-slate-500/20 bg-slate-950/35 text-slate-400"}`}
                >
                  Kirim sebagai {role === "buyer" ? "Pembeli" : "Penjual"}
                </button>
              ))}
            </div>
            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <Textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Tulis pesan transaksi..."
                className="min-h-20"
              />
              <Button type="submit" disabled={loading} className="md:h-full">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Kirim
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <aside className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-300" />
              Status resmi bank
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border border-slate-500/20 bg-slate-950/35 p-4">
              <p className="text-xs uppercase text-slate-500">Barang</p>
              <p className="font-semibold">{escrow.itemName}</p>
              <p className="mt-1 text-sm text-slate-400">{formatRupiah(escrow.amount + escrow.escrowFee)}</p>
            </div>
            <div className="rounded-md border border-amber-400/20 bg-amber-500/10 p-4 text-sm text-amber-100">
              <Lock className="mb-2 h-4 w-4" />
              {officialStatus}
            </div>
            <p className="text-sm leading-6 text-slate-400">
              mAIst hanya percaya status dari sistem bank di aplikasi ini. Screenshot transfer, grup luar, atau pesan "dana sudah masuk" tidak dianggap valid.
            </p>
            <Link href={`/rekber/${escrow.caseId}`} className={buttonVariants({ variant: "default", className: "w-full" })}>
              <Wallet className="h-4 w-4" />
              Buka Pembayaran Resmi
            </Link>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

