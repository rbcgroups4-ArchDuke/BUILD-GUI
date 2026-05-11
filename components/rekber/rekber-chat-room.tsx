"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Bot, Loader2, Lock, Send, ShieldCheck, UserRound, Wallet } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { statusLabel } from "@/lib/i18n";
import { REKBER_ASSISTANT_NAME } from "@/lib/rekber/assistant-config";
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
  const [currentEscrow, setCurrentEscrow] = useState(escrow);
  const [message, setMessage] = useState("Saya sudah transfer, ini bukti transfernya. Apakah penjual boleh kirim data akun?");
  const [loading, setLoading] = useState(false);

  const buyerQuickActions = [
    "Saya sudah transfer, ini bukti transfernya. Apakah penjual boleh kirim barang?",
    "Barang sudah diterima kondisi baik."
  ];

  const officialStatus = useMemo(() => {
    const secured = ["Funds Secured", "Waiting Shipment", "In Transit", "Delivered", "Waiting Buyer Confirmation", "Auto-release Pending", "Released to Seller"].includes(currentEscrow.status);
    return secured
      ? "Dana sudah tercatat aman di escrow bank."
      : "Dana belum tercatat aman. Jangan kirim barang/data dulu.";
  }, [currentEscrow.status]);

  function attachmentUrl(item: RekberChatMessage) {
    return typeof item.metadata?.attachmentUrl === "string" ? item.metadata.attachmentUrl : undefined;
  }

  function attachmentLabel(item: RekberChatMessage) {
    return typeof item.metadata?.attachmentLabel === "string" ? item.metadata.attachmentLabel : "Lampiran";
  }

  function hasVideoAttachment(item: RekberChatMessage) {
    return item.metadata?.attachmentType === "video" && Boolean(attachmentUrl(item));
  }

  function hasImageAttachment(item: RekberChatMessage) {
    return item.metadata?.attachmentType === "image" && Boolean(attachmentUrl(item));
  }

  async function sendMessage(event: React.FormEvent) {
    event.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    const response = await fetch(`/api/rekber/${escrow.caseId}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senderRole: "buyer", message })
    });
    const data = await response.json();
    setMessages(data.messages ?? messages);
    setCurrentEscrow(data.escrow ?? currentEscrow);
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
                Chat Transaksi {REKBER_ASSISTANT_NAME}
              </CardTitle>
              <p className="mt-2 text-sm text-slate-400">
                {REKBER_ASSISTANT_NAME} menjadi admin AI Rekber yang memandu transaksi penjual dan pembeli.
              </p>
            </div>
            <Badge variant={["Funds Secured", "In Transit", "Delivered", "Released to Seller"].includes(currentEscrow.status) ? "success" : "warning"}>{statusLabel(currentEscrow.status)}</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[620px] space-y-4 overflow-y-auto bg-slate-950/35 p-5">
            {messages.map((item) => {
              const isAi = item.senderRole === "ai";
              const isSeller = item.senderRole === "seller";
              const isBuyer = item.senderRole === "buyer";
              return (
                <div
                  key={item.messageId}
                  className={`flex gap-3 ${isBuyer ? "justify-end" : "justify-start"}`}
                >
                  {!isBuyer && (
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
                    {hasImageAttachment(item) && (
                      <div className="mt-3 overflow-hidden rounded-lg border border-white/10 bg-slate-950/45">
                        <img
                          src={attachmentUrl(item)}
                          alt={attachmentLabel(item)}
                          className="h-auto w-full object-cover"
                        />
                        <div className="border-t border-white/10 px-3 py-2 text-xs text-slate-400">
                          Lampiran: {attachmentLabel(item)}
                        </div>
                      </div>
                    )}
                    {hasVideoAttachment(item) && (
                      <div className="mt-3 overflow-hidden rounded-lg border border-white/10 bg-slate-950/45">
                        <video
                          controls
                          preload="metadata"
                          className="aspect-video w-full bg-black"
                          src={attachmentUrl(item)}
                        />
                        <div className="border-t border-white/10 px-3 py-2 text-xs text-slate-400">
                          Lampiran: {attachmentLabel(item)}
                        </div>
                      </div>
                    )}
                  </div>
                  {isBuyer && (
                    <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-blue-500/15 text-blue-200">
                      <UserRound className="h-4 w-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <form onSubmit={sendMessage} className="border-t border-slate-500/10 p-5">
            <div className="mb-3 flex flex-wrap gap-2">
              {buyerQuickActions.map((template) => (
                <button
                  key={template}
                  type="button"
                  onClick={() => setMessage(template)}
                  className="rounded-md border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100 transition hover:border-cyan-300/40 hover:bg-cyan-500/15"
                >
                  {template.includes("transfer") ? "Isi Bukti Transfer" : "Isi Konfirmasi Diterima"}
                </button>
              ))}
            </div>
            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <Textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Tulis pesan sebagai pembeli..."
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
              <p className="font-semibold">{currentEscrow.itemName}</p>
              <p className="mt-1 text-sm text-slate-400">{formatRupiah(currentEscrow.amount + currentEscrow.escrowFee)}</p>
            </div>
            <div className="rounded-md border border-amber-400/20 bg-amber-500/10 p-4 text-sm text-amber-100">
              <Lock className="mb-2 h-4 w-4" />
              {officialStatus}
            </div>
            <p className="text-sm leading-6 text-slate-400">
              {REKBER_ASSISTANT_NAME} hanya memproses status resmi dari sistem Rekber di aplikasi ini. Screenshot transfer atau klaim chat tetap perlu menunggu konfirmasi sistem.
            </p>
            <Link href={`/rekber/${currentEscrow.caseId}`} className={buttonVariants({ variant: "default", className: "w-full" })}>
              <Wallet className="h-4 w-4" />
              Buka Pembayaran Resmi
            </Link>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

