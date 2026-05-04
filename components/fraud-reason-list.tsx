import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FraudReasonList({
  reasons,
  recommendation
}: {
  reasons: string[];
  recommendation: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Penjelasan risiko</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <ul className="space-y-3">
          {reasons.length ? (
            reasons.map((reason) => (
              <li key={reason} className="flex gap-3 text-sm text-slate-300">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-none text-amber-300" />
                <span>{reason}</span>
              </li>
            ))
          ) : (
            <li className="flex gap-3 text-sm text-slate-300">
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-emerald-300" />
              Tidak ada sinyal risiko tinggi yang ditemukan pada data demo.
            </li>
          )}
        </ul>
        <div className="rounded-md border border-cyan-400/20 bg-cyan-500/10 p-4 text-sm text-cyan-100">
          <span className="font-semibold">Rekomendasi: </span>
          {recommendation}
        </div>
      </CardContent>
    </Card>
  );
}
