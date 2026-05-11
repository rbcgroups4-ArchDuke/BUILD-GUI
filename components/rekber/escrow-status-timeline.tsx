import { CheckCircle2, Clock, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { statusLabel } from "@/lib/i18n";
import type { EscrowStatus } from "@/types";

const steps = [
  "Waiting Shipment",
  "In Transit",
  "Delivered",
  "Waiting Buyer Confirmation",
  "Auto-release Pending",
  "Released to Seller"
] as EscrowStatus[];

export function EscrowStatusTimeline({ status }: { status: EscrowStatus }) {
  const activeIndex = Math.max(0, steps.indexOf(status));
  return (
    <div className="space-y-3">
      {steps.map((step, index) => {
        const complete = index < activeIndex || status === "Released to Seller";
        const active = index === activeIndex;
        return (
          <div key={step} className="flex gap-3">
            <div
              className={cn(
                "flex h-8 w-8 flex-none items-center justify-center rounded-full border",
                complete && "border-emerald-400/50 bg-emerald-500/15 text-emerald-200",
                active && "border-cyan-400/50 bg-cyan-500/15 text-cyan-200",
                !complete && !active && "border-slate-500/20 bg-slate-900 text-slate-500"
              )}
            >
              {complete ? <CheckCircle2 className="h-4 w-4" /> : step === "In Transit" ? <Truck className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
            </div>
            <div>
              <p className="text-sm font-medium">{statusLabel(step)}</p>
              <p className="text-xs text-slate-400">
                {active ? "Status kurir atau escrow saat ini." : complete ? "Selesai dalam simulasi." : "Menunggu."}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
