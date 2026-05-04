import { AlertTriangle, Banknote, FileWarning, ShieldCheck, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils";

export function AnalystKpiCards({
  summary
}: {
  summary: {
    suspiciousToday: number;
    highRiskAccounts: number;
    lossPrevented: number;
    activeEscrow: number;
    pendingDisputes: number;
  };
}) {
  const items = [
    { label: "Transaksi mencurigakan hari ini", value: summary.suspiciousToday, icon: AlertTriangle, tone: "text-amber-300" },
    { label: "Rekening risiko tinggi", value: summary.highRiskAccounts, icon: ShieldCheck, tone: "text-red-300" },
    { label: "Potensi kerugian dicegah", value: formatRupiah(summary.lossPrevented), icon: Banknote, tone: "text-emerald-300" },
    { label: "Kasus escrow aktif", value: summary.activeEscrow, icon: Wallet, tone: "text-cyan-300" },
    { label: "Sengketa tertunda", value: summary.pendingDisputes, icon: FileWarning, tone: "text-violet-300" }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label}>
            <CardContent className="p-4">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-slate-900/70">
                <Icon className={`h-5 w-5 ${item.tone}`} />
              </div>
              <p className="text-2xl font-semibold tracking-normal">{item.value}</p>
              <p className="mt-1 text-sm text-slate-400">{item.label}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
