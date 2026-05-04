"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RiskTrendChart({
  data
}: {
  data: Array<{ hour: string; low: number; medium: number; high: number }>;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tren risiko</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72 min-w-0">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
              <defs>
                <linearGradient id="highRisk" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="mediumRisk" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(148,163,184,.12)" vertical={false} />
              <XAxis dataKey="hour" stroke="#94a3b8" tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid rgba(148,163,184,.2)",
                  borderRadius: 8
                }}
              />
              <Area type="monotone" dataKey="medium" stroke="#f59e0b" fill="url(#mediumRisk)" />
              <Area type="monotone" dataKey="high" stroke="#ef4444" fill="url(#highRisk)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full rounded-md bg-slate-950/35" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
