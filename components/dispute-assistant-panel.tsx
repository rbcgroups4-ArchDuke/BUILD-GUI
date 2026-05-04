import { BrainCircuit, FileWarning } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Dispute } from "@/types";

export function DisputeAssistantPanel({ dispute }: { dispute?: Dispute | null }) {
  const summary =
    dispute?.aiSummary ??
    "Pendukung keputusan AI akan merangkum komplain pembeli, status bukti, timeline kurir, dan riwayat sengketa penjual.";
  const recommendation =
    dispute?.aiRecommendation ??
    "Rekomendasi AI: tahan pencairan sampai bukti ditinjau. Tindakan akhir harus disetujui staff bank berwenang.";

  return (
    <Card className="border-cyan-400/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-cyan-300" />
          Asisten sengketa AI
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md border border-slate-500/20 bg-slate-950/35 p-4">
          <p className="mb-2 text-xs uppercase text-slate-500">Ringkasan pendukung keputusan</p>
          <p className="text-sm text-slate-300">{summary}</p>
        </div>
        <div className="rounded-md border border-amber-400/20 bg-amber-500/10 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-amber-100">
            <FileWarning className="h-4 w-4" />
            {recommendation}
          </p>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold">Keputusan akhir staff</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {["Refund pembeli", "Cairkan ke penjual", "Minta bukti tambahan", "Bekukan sementara"].map((action) => (
              <Button key={action} variant="outline" size="sm">{action}</Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
