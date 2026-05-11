"use client";

import { Background, Controls, MiniMap, ReactFlow, type Edge, type Node } from "@xyflow/react";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GraphEdge, GraphNode } from "@/types";
import { maskAccount } from "@/lib/utils";
import { graphNodeLabel } from "@/lib/i18n";

const colors: Record<GraphNode["type"], string> = {
  safe: "#10b981",
  caution: "#f59e0b",
  "high-risk": "#ef4444",
  mule: "#8b5cf6",
  victim: "#2563eb",
  external: "#64748b",
  ewallet: "#06b6d4"
};

const positions: Record<string, { x: number; y: number }> = {
  "victim-a": { x: 0, y: 0 },
  "victim-b": { x: 0, y: 150 },
  "victim-c": { x: 0, y: 300 },
  suspect: { x: 320, y: 150 },
  mule: { x: 640, y: 70 },
  ewallet: { x: 640, y: 230 },
  external: { x: 930, y: 70 }
};

export function AccountGraph({
  nodes,
  edges,
  framed = true
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
  framed?: boolean;
}) {
  const flowNodes: Node[] = useMemo(
    () =>
      nodes.map((node) => ({
        id: node.id,
        position: positions[node.id] ?? { x: 0, y: 0 },
        draggable: false,
        data: {
          label: (
            <div className="min-w-40">
              <div className="text-sm font-semibold">{graphNodeLabel(node.label)}</div>
              <div className="font-mono text-[11px] text-slate-300">{maskAccount(node.accountNumber ?? "")}</div>
              <div className="mt-1 text-[11px] text-slate-400">Risiko {node.riskScore}/100</div>
            </div>
          )
        },
        style: {
          color: "white",
          background: "rgba(15,23,42,.92)",
          border: `1px solid ${colors[node.type]}`,
          borderRadius: 8,
          boxShadow: node.riskScore > 80 ? `0 0 28px ${colors[node.type]}55` : undefined
        }
      })),
    [nodes]
  );

  const flowEdges: Edge[] = useMemo(
    () =>
      edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        animated: true,
        style: { stroke: "#06b6d4", strokeWidth: 2 },
        labelStyle: { fill: "#cbd5e1", fontSize: 11 }
      })),
    [edges]
  );

  const graph = (
    <div className="h-[480px] overflow-hidden rounded-lg border border-slate-500/10 bg-slate-950/50">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        fitView
        colorMode="dark"
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        panOnScroll={false}
      >
        <Background color="rgba(148,163,184,.22)" gap={18} />
        <MiniMap
          pannable
          zoomable
          bgColor="rgba(2,6,23,.88)"
          maskColor="rgba(15,23,42,.64)"
          nodeBorderRadius={4}
          nodeColor="#2563eb"
          nodeStrokeColor="#06b6d4"
          nodeStrokeWidth={2}
          position="bottom-right"
          style={{
            width: 180,
            height: 118,
            border: "1px solid rgba(148,163,184,.18)",
            borderRadius: 8,
            overflow: "hidden"
          }}
        />
        <Controls position="bottom-left" showInteractive={false} />
      </ReactFlow>
    </div>
  );

  if (!framed) return graph;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Graf rekening mencurigakan</CardTitle>
      </CardHeader>
      <CardContent>{graph}</CardContent>
    </Card>
  );
}
