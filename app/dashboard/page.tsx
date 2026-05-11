import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";
import { AnalystKpiCards } from "@/components/dashboard/analyst-kpi-cards";
import { LazyRiskTrendChart } from "@/components/dashboard/lazy-risk-trend-chart";
import { FraudAlertTable } from "@/components/dashboard/fraud-alert-table";
import { CaseManagementTable } from "@/components/dashboard/case-management-table";
import { LazyAccountGraph } from "@/components/dashboard/lazy-account-graph";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardAlerts, dashboardCases, dashboardGraph, dashboardSummary, getAuditLogs } from "@/lib/mock-data/store";

export default function DashboardPage() {
  const summary = dashboardSummary();
  const graph = dashboardGraph();
  const alerts = dashboardAlerts();
  const cases = dashboardCases().slice(0, 5);
  const auditLogs = getAuditLogs();
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <TopNavbar mode="dashboard" />
      <div className="flex">
        <DashboardSidebar active="/dashboard" />
        <section className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase text-cyan-300">Dashboard Analis Fraud</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal">Konsol operasi risiko untuk staff bank.</h1>
          </div>
          <div className="space-y-6">
            <AnalystKpiCards summary={summary} />
            <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
              <LazyRiskTrendChart data={summary.riskTrend} />
              <Card>
                <CardHeader>
                  <CardTitle>Simulasi audit log</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {auditLogs.map((log) => (
                    <div key={log} className="rounded-md border border-slate-500/10 bg-slate-950/35 p-3 font-mono text-xs text-slate-300">{log}</div>
                  ))}
                </CardContent>
              </Card>
            </div>
            <LazyAccountGraph nodes={graph.nodes} edges={graph.edges} />
            <FraudAlertTable alerts={alerts} />
            <CaseManagementTable cases={cases} />
          </div>
        </section>
      </div>
    </main>
  );
}
