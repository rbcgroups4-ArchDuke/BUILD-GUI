import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";
import { ReportsTable } from "@/components/dashboard/reports-table";
import { listReportedAccounts } from "@/lib/mock-data/store";

export default function ReportsPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <TopNavbar mode="dashboard" />
      <div className="flex">
        <DashboardSidebar active="/dashboard/reports" />
        <section className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase text-cyan-300">Rekening dilaporkan</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal">Riwayat sinyal rekening yang dilaporkan.</h1>
          </div>
          <ReportsTable reports={listReportedAccounts()} />
        </section>
      </div>
    </main>
  );
}
