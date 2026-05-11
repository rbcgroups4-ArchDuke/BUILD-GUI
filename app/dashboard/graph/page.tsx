import { Filter } from "lucide-react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";
import { LazyAccountGraph } from "@/components/dashboard/lazy-account-graph";
import { Card, CardContent } from "@/components/ui/card";
import { dashboardGraph } from "@/lib/mock-data/store";

export default function GraphPage() {
  const graph = dashboardGraph();
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <TopNavbar mode="dashboard" />
      <div className="flex">
        <DashboardSidebar active="/dashboard/graph" />
        <section className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase text-cyan-300">Graf jaringan</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal">Eksplorasi relasi rekening.</h1>
          </div>
          <Card className="mb-6">
            <CardContent className="grid gap-3 p-4 md:grid-cols-4">
              {["Rentang waktu: 24 jam terakhir", "Skor risiko: 60+", "Nominal: Rp1 juta+", "Tipe rekening: Semua"].map((filter) => (
                <div key={filter} className="flex items-center gap-2 rounded-md border border-slate-500/20 bg-slate-950/35 px-3 py-2 text-sm text-slate-300">
                  <Filter className="h-4 w-4 text-cyan-300" />
                  {filter}
                </div>
              ))}
            </CardContent>
          </Card>
          <LazyAccountGraph nodes={graph.nodes} edges={graph.edges} />
        </section>
      </div>
    </main>
  );
}
