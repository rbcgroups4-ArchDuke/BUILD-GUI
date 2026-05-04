import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { fraudCategoryLabel, statusLabel } from "@/lib/i18n";
import { formatDateTime, maskAccount } from "@/lib/utils";
import type { ReportedAccount } from "@/types";

export function ReportsTable({ reports }: { reports: ReportedAccount[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Riwayat rekening dilaporkan</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="text-xs uppercase text-slate-500">
            <tr>
              <th className="pb-3">Rekening</th>
              <th className="pb-3">Laporan</th>
              <th className="pb-3">Terverifikasi</th>
              <th className="pb-3">Kategori</th>
              <th className="pb-3">Laporan terakhir</th>
              <th className="pb-3">Risiko</th>
              <th className="pb-3">Bukti</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-500/10">
            {reports.map((report) => (
              <tr key={report.accountNumber}>
                <td className="py-3 font-mono text-xs">{maskAccount(report.accountNumber)}</td>
                <td className="py-3">{report.numberOfReports}</td>
                <td className="py-3">{report.verifiedReports}</td>
                <td className="py-3">{fraudCategoryLabel(report.fraudCategory)}</td>
                <td className="py-3 text-slate-400">{formatDateTime(report.lastReportDate)}</td>
                <td className="py-3"><StatusBadge status={report.riskStatus} /></td>
                <td className="py-3 text-slate-300">{statusLabel(report.evidenceStatus)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
