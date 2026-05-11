"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Lock, Send, Wallet } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RiskScoreCard } from "@/components/fraud/risk-score-card";
import { FraudReasonList } from "@/components/fraud/fraud-reason-list";
import type { RiskCheckResult } from "@/types";

export function TransactionSimulator() {
  const [recipientAccount, setRecipientAccount] = useState("1234567890");
  const [amount, setAmount] = useState("6500000");
  const [result, setResult] = useState<{ risk: RiskCheckResult; allowed: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (loading) return; // Prevent multiple submissions
    setLoading(true);
    try {
      const response = await fetch("/api/transfer/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientAccount,
          amount: Number(amount),
          description: "Pembayaran iPhone 13 via Facebook marketplace",
          platform: "Facebook"
        })
      });
      setResult(await response.json());
    } catch (error) {
      console.error("Failed to simulate transfer:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <Card>
        <CardHeader>
          <CardTitle>Simulasi transfer</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Rekening penerima</Label>
              <Input id="recipient" value={recipientAccount} onChange={(event) => setRecipientAccount(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Nominal</Label>
              <Input id="amount" value={amount} onChange={(event) => setAmount(event.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Simulasikan Transfer
            </Button>
          </form>
        </CardContent>
      </Card>
      {result ? (
        <div className="space-y-6">
          <RiskScoreCard score={result.risk.score} level={result.risk.level} />
          <Card className={result.allowed ? "border-emerald-400/20" : "border-red-400/25"}>
            <CardContent className="p-5">
              <div className="mb-3 flex items-center gap-2 text-lg font-semibold">
                {result.allowed ? <ArrowRight className="h-5 w-5 text-emerald-300" /> : <Lock className="h-5 w-5 text-red-300" />}
                {result.allowed ? "Transfer diizinkan dalam simulasi" : "Peringatan pemblokiran"}
              </div>
              <p className="text-sm text-slate-300">{result.message}</p>
            </CardContent>
          </Card>
          <FraudReasonList reasons={result.risk.reasons} recommendation={result.risk.recommendedAction} />
          {!result.allowed && (
            <Link href="/rekber/create" className={buttonVariants({ variant: "default" })}>
              <Wallet className="h-4 w-4" />
              Buat Rekber Link Bank
            </Link>
          )}
        </div>
      ) : (
        <Card className="min-h-[420px]">
          <CardContent className="flex h-full min-h-[420px] items-center justify-center p-8 text-center text-slate-400">
            Skor fraud real-time akan muncul di sini sebelum transfer diselesaikan.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
