"use client";

import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import type { GraphEdge, GraphNode } from "@/types";

const AccountGraph = dynamic(
  () => import("@/components/dashboard/account-graph").then((mod) => mod.AccountGraph),
  {
    ssr: false,
    loading: () => (
      <Card>
        <CardContent className="p-8 text-center text-slate-400">Memuat graf analis...</CardContent>
      </Card>
    )
  }
);

export function LazyAccountGraph({
  nodes,
  edges,
  framed = true
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
  framed?: boolean;
}) {
  return <AccountGraph nodes={nodes} edges={edges} framed={framed} />;
}
