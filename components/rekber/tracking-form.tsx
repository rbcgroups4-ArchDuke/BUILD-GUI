"use client";

import { useState } from "react";
import { Loader2, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EscrowStatusTimeline } from "@/components/rekber/escrow-status-timeline";
import type { EscrowCase, EscrowStatus } from "@/types";

export function TrackingForm({ escrow }: { escrow: EscrowCase }) {
  const [trackingNumber, setTrackingNumber] = useState(escrow.trackingNumber ?? "JNE-8821-4409-ID");
  const [status, setStatus] = useState<EscrowStatus>(escrow.status);
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    const response = await fetch(`/api/rekber/${escrow.caseId}/tracking`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackingNumber, markDelivered: true })
    });
    const data = await response.json();
    setStatus(data.escrow.status);
    setLoading(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
      <form onSubmit={submit} className="space-y-4 rounded-lg border border-slate-500/20 bg-slate-950/35 p-5">
        <div className="space-y-2">
          <Label>Nomor resi kurir</Label>
          <Input value={trackingNumber} onChange={(event) => setTrackingNumber(event.target.value)} />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Truck className="h-4 w-4" />}
          Kirim resi dan tandai terkirim
        </Button>
      </form>
      <EscrowStatusTimeline status={status} />
    </div>
  );
}
