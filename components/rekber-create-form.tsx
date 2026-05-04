"use client";

import Link from "next/link";
import { useState } from "react";
import { Bot, ImagePlus, Loader2, Wallet } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatRupiah } from "@/lib/utils";
import type { EscrowCase } from "@/types";

export function RekberCreateForm() {
  const [form, setForm] = useState({
    itemName: "iPhone 13 128GB Midnight",
    itemPrice: "6500000",
    itemDescription: "Used, fullset box, battery health 88%, listed via Facebook group.",
    sellerUsername: "fb.com/market.aris",
    buyerUsername: "fb.com/dina.securebuy",
    courier: "JNE",
    shippingDeadline: "2026-05-06",
    escrowFee: "65000"
  });
  const [created, setCreated] = useState<{ escrow: EscrowCase; publicUrl: string } | null>(null);
  const [loading, setLoading] = useState(false);

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    const response = await fetch("/api/rekber/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        amount: Number(form.itemPrice),
        escrowFee: Number(form.escrowFee)
      })
    });
    setCreated(await response.json());
    setLoading(false);
  }

  if (created) {
    return (
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle>Link rekber bank aman berhasil dibuat.</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-lg border border-cyan-400/20 bg-cyan-500/10 p-5">
            <p className="text-xs uppercase text-cyan-200">Rekber Link yang dibuat</p>
            <p className="mt-2 break-all font-mono text-lg text-white">{created.publicUrl}</p>
          </div>
          <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
            <div><p className="text-slate-500">Barang</p>{created.escrow.itemName}</div>
            <div><p className="text-slate-500">Harga</p>{formatRupiah(created.escrow.amount)}</div>
            <div><p className="text-slate-500">Biaya rekber</p>{formatRupiah(created.escrow.escrowFee)}</div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href={`/rekber/${created.escrow.caseId}/chat`} className={buttonVariants({ variant: "default" })}>
              <Bot className="h-4 w-4" />
              Buka Chat mAIst
            </Link>
            <Link href={`/rekber/${created.escrow.caseId}`} className={buttonVariants({ variant: "outline" })}>
              Buka halaman pembayaran pembeli
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Buat link escrow / rekber bank</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-2">
            <Label>Nama barang</Label>
            <Input value={form.itemName} onChange={(event) => update("itemName", event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Harga barang</Label>
            <Input value={form.itemPrice} onChange={(event) => update("itemPrice", event.target.value)} />
          </div>
          <div className="space-y-2 lg:col-span-2">
            <Label>Deskripsi barang</Label>
            <Textarea value={form.itemDescription} onChange={(event) => update("itemDescription", event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Username Facebook penjual</Label>
            <Input value={form.sellerUsername} onChange={(event) => update("sellerUsername", event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Username Facebook pembeli</Label>
            <Input value={form.buyerUsername} onChange={(event) => update("buyerUsername", event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Pilihan kurir</Label>
            <select value={form.courier} onChange={(event) => update("courier", event.target.value)} className="h-11 w-full rounded-md border border-slate-500/20 bg-slate-950/35 px-3 text-sm">
              {["JNE", "J&T", "SiCepat", "AnterAja", "Other"].map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Batas waktu pengiriman</Label>
            <Input type="date" value={form.shippingDeadline} onChange={(event) => update("shippingDeadline", event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Biaya rekber</Label>
            <Input value={form.escrowFee} onChange={(event) => update("escrowFee", event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Placeholder unggah foto barang</Label>
            <div className="flex h-11 items-center gap-2 rounded-md border border-dashed border-slate-500/30 bg-slate-950/35 px-3 text-sm text-slate-400">
              <ImagePlus className="h-4 w-4" />
              Unggah gambar disimulasikan
            </div>
          </div>
          <div className="lg:col-span-2">
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
              Buat link aman
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
