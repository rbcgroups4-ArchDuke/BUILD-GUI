"use client";

import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";

const HybridFdsLab = dynamic(
  () => import("@/components/dashboard/hybrid-fds-lab").then((mod) => mod.HybridFdsLab),
  {
    ssr: false,
    loading: () => (
      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-5">
                <div className="mb-4 h-10 w-10 animate-pulse rounded-md bg-slate-900/80" />
                <div className="h-4 w-32 animate-pulse rounded bg-slate-900/80" />
                <div className="mt-3 h-8 w-24 animate-pulse rounded bg-slate-900/80" />
                <div className="mt-3 h-14 animate-pulse rounded bg-slate-950/35" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardContent className="h-96 animate-pulse p-6" />
          </Card>
          <Card>
            <CardContent className="h-96 animate-pulse p-6" />
          </Card>
        </div>
      </div>
    )
  }
);

export function LazyHybridFdsLab() {
  return <HybridFdsLab />;
}
