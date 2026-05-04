import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { caseTitleLabel, caseTypeLabel } from "@/lib/i18n";
import { formatDateTime } from "@/lib/utils";
import type { AnalystCase } from "@/types";

export function CaseManagementTable({ cases }: { cases: AnalystCase[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manajemen kasus</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="text-xs uppercase text-slate-500">
            <tr>
              <th className="pb-3">Kasus</th>
              <th className="pb-3">Tipe</th>
              <th className="pb-3">Risiko</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Analis</th>
              <th className="pb-3">Pembaruan terakhir</th>
              <th className="pb-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-500/10">
            {cases.map((item) => (
              <tr key={`${item.caseId}-${item.title}`}>
                <td className="py-3">
                  <p className="font-mono text-xs text-slate-300">{item.caseId}</p>
                  <p className="mt-1 max-w-sm truncate text-slate-400">{caseTitleLabel(item.title)}</p>
                </td>
                <td className="py-3">{caseTypeLabel(item.type)}</td>
                <td className="py-3 font-semibold">{item.riskScore}/100</td>
                <td className="py-3"><StatusBadge status={item.status} /></td>
                <td className="py-3 text-slate-300">{item.assignedAnalyst}</td>
                <td className="py-3 text-slate-400">{formatDateTime(item.lastUpdate)}</td>
                <td className="py-3 text-right">
                  <Button size="sm" variant="outline"><Eye className="h-4 w-4" />Buka</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
