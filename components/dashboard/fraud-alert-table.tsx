import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { formatDateTime, formatRupiah, maskAccount } from "@/lib/utils";
import type { BankAccount, Transaction } from "@/types";

export function FraudAlertTable({
  alerts
}: {
  alerts: Array<Transaction & { receiver?: BankAccount }>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tabel peringatan</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="text-xs uppercase text-slate-500">
            <tr>
              <th className="pb-3">Transaksi</th>
              <th className="pb-3">Penerima</th>
              <th className="pb-3">Nominal</th>
              <th className="pb-3">Kanal</th>
              <th className="pb-3">Risiko</th>
              <th className="pb-3">Diperbarui</th>
              <th className="pb-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-500/10">
            {alerts.map((alert) => (
              <tr key={alert.txId}>
                <td className="py-3 font-mono text-xs text-slate-300">{alert.txId}</td>
                <td className="py-3">{maskAccount(alert.receiverAccount)}</td>
                <td className="py-3">{formatRupiah(alert.amount)}</td>
                <td className="py-3 text-slate-400">{alert.channel}</td>
                <td className="py-3"><StatusBadge status={alert.riskScore > 80 ? "Critical" : "High Risk"} /></td>
                <td className="py-3 text-slate-400">{formatDateTime(alert.timestamp)}</td>
                <td className="py-3 text-right">
                  <Button size="sm" variant="outline"><Eye className="h-4 w-4" />Tinjau</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
