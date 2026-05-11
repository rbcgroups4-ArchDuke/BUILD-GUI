"use client";

import { useState } from "react";
import { FileUp, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DisputeAssistantPanel } from "@/components/rekber/dispute-assistant-panel";
import type { Dispute, EscrowCase } from "@/types";

export function DisputeForm({ escrow, initialDispute }: { escrow: EscrowCase; initialDispute?: Dispute | null }) {
  const [complaint, setComplaint] = useState(
    initialDispute?.buyerComplaint ?? "Package arrived, but the box was empty and courier weight looks inconsistent."
  );
  const [dispute, setDispute] = useState<Dispute | null>(initialDispute ?? null);
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    const response = await fetch(`/api/rekber/${escrow.caseId}/dispute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ complaint })
    });
    const data = await response.json();
    setDispute(data.dispute);
    setLoading(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <form onSubmit={submit} className="space-y-4 rounded-lg border border-slate-500/20 bg-slate-950/35 p-5">
        <Button type="submit" variant="danger" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
          Komplain / Tahan Pencairan
        </Button>
        <div className="space-y-2">
          <Label>Placeholder unggah bukti</Label>
          <div className="flex h-12 items-center gap-2 rounded-md border border-dashed border-slate-500/30 px-3 text-sm text-slate-400">
            <FileUp className="h-4 w-4" />
            Foto, video unboxing, invoice, dan resi kurir disimulasikan
          </div>
        </div>
        <div className="space-y-2">
          <Label>Detail komplain</Label>
          <Textarea value={complaint} onChange={(event) => setComplaint(event.target.value)} />
        </div>
      </form>
      <DisputeAssistantPanel dispute={dispute} />
    </div>
  );
}
