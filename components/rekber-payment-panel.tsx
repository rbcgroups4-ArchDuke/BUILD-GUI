"use client";

import { useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { statusLabel } from "@/lib/i18n";
import type { EscrowCase } from "@/types";

export function RekberPaymentPanel({ escrow }: { escrow: EscrowCase }) {
  const [status, setStatus] = useState(escrow.status);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function pay() {
    setLoading(true);
    const response = await fetch(`/api/rekber/${escrow.caseId}/pay`, { method: "POST" });
    const data = await response.json();
    setStatus(data.escrow.status);
    setMessage(data.message);
    setLoading(false);
  }

  return (
    <div className="rounded-lg border border-emerald-400/20 bg-emerald-500/10 p-5">
      <p className="mb-2 text-sm text-slate-300">Status saat ini: <span className="font-semibold text-white">{statusLabel(status)}</span></p>
      <p className="mb-4 text-sm text-slate-400">
        Dana akan ditahan di dompet escrow simulasi bank sampai barang diterima, pembeli mengonfirmasi, atau sengketa diputus staff.
      </p>
      <Button onClick={pay} disabled={loading || status === "Funds Secured"}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
        Simulasikan Pembayaran ke Escrow
      </Button>
      {message && <p className="mt-3 text-sm text-emerald-100">{message}</p>}
    </div>
  );
}
