"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, memo } from "react";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskLevelBadge } from "@/components/shared/status-badge";
import type { RiskLevel } from "@/types";
import { cn } from "@/lib/utils";

export const RiskScoreCard = memo(function RiskScoreCard({
  score,
  level,
  compact = false
}: {
  score: number;
  level: RiskLevel;
  compact?: boolean;
}) {
  const value = useMotionValue(0);
  const rounded = useTransform(value, (latest) => Math.round(latest));
  const critical = score > 80;

  useEffect(() => {
    const controls = animate(value, score, { duration: 0.9, ease: "easeOut" });
    return controls.stop;
  }, [score, value]);

  return (
    <Card className={cn("overflow-hidden", critical && "border-red-400/30")}>
      <CardHeader className={compact ? "p-4" : undefined}>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Skor risiko</CardTitle>
          <RiskLevelBadge level={level} />
        </div>
      </CardHeader>
      <CardContent className={cn("space-y-4", compact && "p-4 pt-0")}>
        <div className="flex items-end gap-2">
          <motion.span className="text-5xl font-semibold tracking-normal text-white">{rounded}</motion.span>
          <span className="pb-2 text-sm text-slate-400">/100</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.9 }}
            className={cn(
              "h-full rounded-full",
              score <= 30 && "bg-emerald-400",
              score > 30 && score <= 60 && "bg-amber-400",
              score > 60 && score <= 80 && "bg-orange-500",
              score > 80 && "bg-red-500"
            )}
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          {critical ? <AlertTriangle className="h-4 w-4 text-red-300" /> : <ShieldCheck className="h-4 w-4 text-emerald-300" />}
          Sinyal fraud yang bisa dijelaskan dari aturan demo.
        </div>
      </CardContent>
    </Card>
  );
});
