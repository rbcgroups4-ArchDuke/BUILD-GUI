"use client";

import { useMemo, useState } from "react";
import { Activity, Ban, CheckCircle2, Cpu, Filter, Loader2, Play, Radar, SearchCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatRupiah } from "@/lib/utils";

type Level = "Aman" | "Waspada" | "Risiko Tinggi" | "Risiko Kritis";

function levelFromScore(score: number): Level {
  if (score <= 30) return "Aman";
  if (score <= 60) return "Waspada";
  if (score <= 80) return "Risiko Tinggi";
  return "Risiko Kritis";
}

function calculateHybridRisk(input: {
  amount: number;
  monthlyAverage: number;
  hour: number;
  deviceKnown: boolean;
  ipKnown: boolean;
  newReceiverCount: number;
}) {
  const reasons: string[] = [];
  const amountRatio = input.monthlyAverage > 0 ? input.amount / input.monthlyAverage : 1;
  let ruleScore = 8;

  if (amountRatio >= 5) {
    ruleScore += 26;
    reasons.push(`Nominal transaksi ${amountRatio.toFixed(1)}x lebih besar dari rata-rata bulanan nasabah.`);
  } else if (amountRatio >= 2) {
    ruleScore += 12;
    reasons.push(`Nominal transaksi ${amountRatio.toFixed(1)}x lebih besar dari kebiasaan normal.`);
  }
  if (input.hour < 5 || input.hour > 23) {
    ruleScore += 14;
    reasons.push("Transaksi dilakukan pada jam tidak biasa untuk profil nasabah.");
  }
  if (!input.deviceKnown) {
    ruleScore += 18;
    reasons.push("Perangkat baru terdeteksi dan belum pernah dipakai nasabah.");
  }
  if (!input.ipKnown) {
    ruleScore += 12;
    reasons.push("Lokasi/IP tidak cocok dengan pola transaksi historis nasabah.");
  }
  if (input.newReceiverCount >= 3) {
    ruleScore += 16;
    reasons.push("Banyak rekening tujuan baru muncul dalam 24 jam terakhir.");
  }

  const anomalyScore = Math.min(
    100,
    Math.round(amountRatio * 12 + (!input.deviceKnown ? 22 : 0) + (!input.ipKnown ? 16 : 0) + input.newReceiverCount * 8)
  );
  const finalScore = Math.min(100, Math.round(ruleScore * 0.48 + anomalyScore * 0.52));

  if (reasons.length === 0) {
    reasons.push("Tidak ada penyimpangan besar dari pola historis nasabah. Sistem menurunkan risiko untuk mengurangi false positive.");
  }

  return { ruleScore, anomalyScore, finalScore, level: levelFromScore(finalScore), reasons };
}

const initialAlerts = [
  {
    id: "FDS-2026-0901",
    account: "••••••7890",
    amount: 6500000,
    score: 87,
    status: "Baru",
    reason: "Nominal 5.3x lebih besar, perangkat baru, dan cash-out cepat ke rekening baru."
  },
  {
    id: "FDS-2026-0902",
    account: "••••••1900",
    amount: 2450000,
    score: 91,
    status: "Baru",
    reason: "Pola chat rekber palsu, noreff/refund, dan bukti transfer eksternal."
  },
  {
    id: "FDS-2026-0903",
    account: "••••••2233",
    amount: 1800000,
    score: 24,
    status: "Aman",
    reason: "Nominal sesuai kebiasaan dan perangkat/IP dikenal. Alert diturunkan untuk mengurangi false positive."
  }
];

export function HybridFdsLab() {
  const [amount, setAmount] = useState("6500000");
  const [monthlyAverage, setMonthlyAverage] = useState("1250000");
  const [hour, setHour] = useState("01");
  const [deviceKnown, setDeviceKnown] = useState(false);
  const [ipKnown, setIpKnown] = useState(false);
  const [newReceiverCount, setNewReceiverCount] = useState("4");
  const [running, setRunning] = useState(false);
  const [alerts, setAlerts] = useState(initialAlerts);

  const result = useMemo(
    () =>
      calculateHybridRisk({
        amount: Number(amount),
        monthlyAverage: Number(monthlyAverage),
        hour: Number(hour),
        deviceKnown,
        ipKnown,
        newReceiverCount: Number(newReceiverCount)
      }),
    [amount, monthlyAverage, hour, deviceKnown, ipKnown, newReceiverCount]
  );

  function streamTransaction() {
    setRunning(true);
    setTimeout(() => {
      setAlerts((current) => [
        {
          id: `FDS-2026-${String(910 + current.length)}`,
          account: "••••••" + String(Math.floor(1000 + Math.random() * 8999)),
          amount: Number(amount),
          score: result.finalScore,
          status: result.finalScore >= 60 ? "Baru" : "Aman",
          reason: result.reasons[0]
        },
        ...current
      ]);
      setRunning(false);
    }, 600);
  }

  function updateStatus(id: string, status: string) {
    setAlerts((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { icon: Cpu, title: "Rule-Based Engine", value: `${result.ruleScore}/100`, body: "Mengecek aturan dasar seperti nominal, jam, perangkat, dan rekening tujuan baru." },
          { icon: Radar, title: "Isolation Forest", value: `${result.anomalyScore}/100`, body: "Simulasi skor anomali historis per nasabah, bukan tren agregat massal." },
          { icon: Activity, title: "Final Risk Score", value: `${result.finalScore}/100`, body: "Gabungan rule-based dan anomali historis untuk mengurangi false positive." },
          { icon: SearchCheck, title: "Explainable AI", value: result.level, body: "Alasan risiko diterjemahkan menjadi narasi yang bisa ditindaklanjuti analis." }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title}>
              <CardContent className="p-5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-cyan-500/15 text-cyan-200">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm text-slate-400">{item.title}</p>
                <p className="mt-2 text-2xl font-semibold">{item.value}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{item.body}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Simulator FDS Hybrid</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Nominal transaksi</Label>
                <Input value={amount} onChange={(event) => setAmount(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Rata-rata bulanan nasabah</Label>
                <Input value={monthlyAverage} onChange={(event) => setMonthlyAverage(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Jam transaksi</Label>
                <Input value={hour} onChange={(event) => setHour(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Rekening tujuan baru 24 jam</Label>
                <Input value={newReceiverCount} onChange={(event) => setNewReceiverCount(event.target.value)} />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex items-center gap-3 rounded-md border border-slate-500/20 bg-slate-950/35 p-3 text-sm">
                <input type="checkbox" checked={deviceKnown} onChange={(event) => setDeviceKnown(event.target.checked)} />
                Perangkat dikenal
              </label>
              <label className="flex items-center gap-3 rounded-md border border-slate-500/20 bg-slate-950/35 p-3 text-sm">
                <input type="checkbox" checked={ipKnown} onChange={(event) => setIpKnown(event.target.checked)} />
                Lokasi/IP dikenal
              </label>
            </div>
            <Textarea readOnly value={result.reasons.join("\n")} className="min-h-32" />
            <Button onClick={streamTransaction} disabled={running}>
              {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              Jalankan auto stream transaksi
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle>Manajemen investigasi alert</CardTitle>
              <Badge variant="default"><Filter className="mr-1 h-3 w-3" />Skor 60+</Badge>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr>
                  <th className="pb-3">Alert</th>
                  <th className="pb-3">Rekening</th>
                  <th className="pb-3">Nominal</th>
                  <th className="pb-3">Skor</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Reason Summary</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-500/10">
                {alerts.map((alert) => (
                  <tr key={alert.id}>
                    <td className="py-3 font-mono text-xs">{alert.id}</td>
                    <td className="py-3 font-mono text-xs">{alert.account}</td>
                    <td className="py-3">{formatRupiah(alert.amount)}</td>
                    <td className="py-3 font-semibold">{alert.score}/100</td>
                    <td className="py-3"><StatusBadge status={alert.status === "Aman" ? "Safe" : alert.status} /></td>
                    <td className="max-w-md py-3 text-slate-400">{alert.reason}</td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => updateStatus(alert.id, "Ditinjau")}>Tinjau</Button>
                        <Button size="sm" variant="success" onClick={() => updateStatus(alert.id, "Aman")}><CheckCircle2 className="h-4 w-4" />Aman</Button>
                        <Button size="sm" variant="danger" onClick={() => updateStatus(alert.id, "Diblokir")}><Ban className="h-4 w-4" />Blokir</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
