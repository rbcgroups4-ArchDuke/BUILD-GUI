"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertTriangle, Ban, Loader2, ShieldCheck, Wallet } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RiskScoreCard } from "@/components/risk-score-card";
import { FraudReasonList } from "@/components/fraud-reason-list";
import { maskAccount } from "@/lib/utils";
import type { PlatformSource, RiskCheckResult } from "@/types";

export function AccountCheckForm() {
  const [accountNumber, setAccountNumber] = useState("1234567890");
  const [amount, setAmount] = useState("6500000");
  const [description, setDescription] = useState("Payment for iPhone 13 via Facebook marketplace");
  const [platform, setPlatform] = useState<PlatformSource>("Facebook");
  const [result, setResult] = useState<RiskCheckResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    const response = await fetch("/api/risk/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accountNumber, amount: Number(amount), description, platform })
    });
    setResult(await response.json());
    setLoading(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Cek rekening tujuan</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="account">Nomor rekening bank tujuan</Label>
              <Input id="account" value={accountNumber} onChange={(event) => setAccountNumber(event.target.value)} inputMode="numeric" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Nominal transfer</Label>
              <Input id="amount" value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="numeric" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Keterangan transaksi</Label>
              <Textarea id="description" value={description} onChange={(event) => setDescription(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="platform">Sumber platform</Label>
              <select
                id="platform"
                value={platform}
                onChange={(event) => setPlatform(event.target.value as PlatformSource)}
                className="h-11 w-full rounded-md border border-slate-500/20 bg-slate-950/35 px-3 text-sm"
              >
                {["Facebook", "Instagram", "WhatsApp", "Marketplace", "Other"].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              Cek Risiko
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {result ? (
          <>
            <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr]">
              <RiskScoreCard score={result.score} level={result.level} />
              <Card>
                <CardHeader>
                  <CardTitle>Hasil rekening</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-md border border-slate-500/20 bg-slate-950/35 p-4">
                    <p className="text-xs uppercase text-slate-500">Rekening</p>
                    <p className="font-mono text-lg">{maskAccount(result.accountNumber)}</p>
                  </div>
                  <p className="text-sm text-slate-400">
                    Nomor rekening penuh disamarkan di tampilan. Prototipe ini hanya memakai data demo.
                  </p>
                </CardContent>
              </Card>
            </div>
            <FraudReasonList reasons={result.reasons} recommendation={result.recommendedAction} />
            <div className="grid gap-3 sm:grid-cols-3">
              <Link href="/rekber/create" className={buttonVariants({ variant: "default" })}>
                <Wallet className="h-4 w-4" />
                Pakai Rekber Link Bank
              </Link>
              <Button variant="danger"><Ban className="h-4 w-4" />Batalkan Transfer</Button>
              <Button variant="outline"><AlertTriangle className="h-4 w-4" />Lanjut dengan Risiko</Button>
            </div>
          </>
        ) : (
          <Card className="flex min-h-[460px] items-center justify-center">
            <CardContent className="max-w-md p-8 text-center">
              <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-cyan-300" />
              <p className="text-lg font-semibold">Siap melakukan skor risiko real-time</p>
              <p className="mt-2 text-sm text-slate-400">
                The default values reproduce the hackathon demo. You can also test the synthetic AI Rekber pattern with account 901300001900 and descriptions like “format transaksi jual beli akun digital, dana sudah masuk, noreff”.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
