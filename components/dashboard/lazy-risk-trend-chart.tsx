"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RiskTrendChart = dynamic(
  () => import("@/components/dashboard/risk-trend-chart").then((mod) => mod.RiskTrendChart),
  {
    ssr: false,
    loading: () => (
      <Card>
        <CardHeader>
          <CardTitle>Tren risiko</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 animate-pulse rounded-md bg-slate-950/35" />
        </CardContent>
      </Card>
    )
  }
);

export function LazyRiskTrendChart({
  data
}: {
  data: Array<{ hour: string; low: number; medium: number; high: number }>;
}) {
  return <RiskTrendChart data={data} />;
}
